import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import axios from "axios";
import { Readable } from "stream";

type EvaluationResult = {
  // Which politician gave the most speeches in 2013?
  mostSpeeches: string | null;
  // Which politician gave the most speeches on the topic „Internal Security"?
  mostSecurity: string | null;
  // Which politician used the fewest words (in total)?
  leastWordy: string | null;
};

type SpeakerMetric = {
  speaker: string;
  count2013: number;
  countInternalSecurity: number;
  totalWordCount: number;
};

@Controller()
export class AppController {
  constructor() {}

  async getFileStream(url: string): Promise<Readable> {
    try {
      const response = await axios.get(url, { responseType: "stream" });
      const excelStream = response.data;

      return excelStream;
    } catch (err) {
      console.error(err);
      const message = `File is not valid, Message: ${err.message}, URL: ${url}`;
      throw new BadRequestException(message);
    }
  }

  @Get("evaluation")
  async evaluation(
    @Query("url") url: string | string[],
  ): Promise<EvaluationResult> {
    if (!url) {
      throw new BadRequestException("URL is required");
    }
    const urls = Array.isArray(url) ? url : [url];
    // Store related information for each speaker, update for every row
    const speakerMetricMap: Record<string, SpeakerMetric> = {};

    const excelReadPromises = urls.map(async (nextUrl) => {
      const excelFileStream = await this.getFileStream(nextUrl);
      // Read every row until the end of the stream
      return new Promise<void>((resolve, reject) => {
        excelFileStream.on("data", (chunk) => {
          const rows = chunk.toString().split("\n");

          rows.forEach((row, index) => {
            if (row.trim() === "" || index === 0) return;
            const [speaker, subject, dateStr, wordCountStr] = row.split(", ");
            const year = new Date(dateStr).getUTCFullYear();

            if (!speakerMetricMap[speaker]) {
              speakerMetricMap[speaker] = {
                speaker,
                count2013: 0,
                totalWordCount: 0,
                countInternalSecurity: 0,
              };
            }

            speakerMetricMap[speaker].totalWordCount += Number(wordCountStr);
            if (year === 2013) {
              speakerMetricMap[speaker].count2013 += 1;
            }
            if (subject === "Internal Security") {
              speakerMetricMap[speaker].countInternalSecurity += 1;
            }
          });
        });

        excelFileStream.on("end", () => {
          resolve();
        });
        excelFileStream.on("error", reject);
      });
    });

    await Promise.all(excelReadPromises);

    const speakerMetrics = Object.values(speakerMetricMap);

    // Find the speaker who has maximum count2013
    const mostSpeeches =
      speakerMetrics.reduce((acc, metric) => {
        if (metric.count2013 > (acc?.count2013 || 0)) {
          return metric;
        }
        return acc;
      }, null)?.speaker || null;

    // Find the speaker who has maximum countInternalSecurity
    const mostSecurity =
      speakerMetrics.reduce((acc, metric) => {
        if (metric.countInternalSecurity > (acc?.countInternalSecurity || 0)) {
          return metric;
        }
        return acc;
      }, null)?.speaker || null;

    // Find the speaker who has minimum totalWordCount
    const leastWordy =
      speakerMetrics.reduce((acc, metric) => {
        if (
          metric.totalWordCount <
          (acc?.totalWordCount || Number.MAX_SAFE_INTEGER)
        ) {
          return metric;
        }
        return acc;
      }, null)?.speaker || null;

    return {
      mostSpeeches,
      mostSecurity,
      leastWordy,
    };
  }
}
