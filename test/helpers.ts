import * as path from "path";
import * as fs from "fs";

export const getMockFileStream = async (url: string) => {
  switch (url) {
    case "url1":
      return fs.createReadStream(path.join(__dirname, "./politics_en.csv"));

    case "url2":
      return fs.createReadStream(path.join(__dirname, "./politics_en_2.csv"));

    default:
      return fs.createReadStream(path.join(__dirname, "./politics_en.csv"));
  }
};

export const getAxiosMockFileStream = async (url: string) => {
  switch (url) {
    case "url1":
      return {
        data: fs.createReadStream(path.join(__dirname, "./politics_en.csv")),
      };

    case "url2":
      return {
        data: fs.createReadStream(path.join(__dirname, "./politics_en_2.csv")),
      };

    default:
      return {
        data: fs.createReadStream(path.join(__dirname, "./politics_en.csv")),
      };
  }
};

export const mockResultSingleUrl = {
  mostSpeeches: null,
  mostSecurity: "Alexander Abel",
  leastWordy: "Caesare Collins",
};

export const mockResultMultiUrl = {
  mostSpeeches: "Alexander Abel",
  mostSecurity: "Caesare Collins",
  leastWordy: "Alexander Abel",
};
