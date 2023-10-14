import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
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

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
    jest
      .spyOn(appController, "getFileStream")
      .mockImplementation(getMockFileStream);
  });

  describe("Fashion Digital – Recruitment Exercise Node.js", () => {
    it("should calculate right with single URL", async () => {
      const result = await appController.evaluation("url1");
      expect(result).toStrictEqual(mockResultSingleUrl);
    });

    it("should calculate right with multiple URLs", async () => {
      const result = await appController.evaluation(["url1", "url2"]);
      expect(result).toStrictEqual(mockResultMultiUrl);
    });
  });
});
