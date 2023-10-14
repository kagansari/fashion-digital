import { Test, TestingModule } from "@nestjs/testing";
import {
  getMockFileStream,
  mockResultMultiUrl,
  mockResultSingleUrl,
} from "../test/helpers";
import { AppController } from "./app.controller";

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

    it("should calculate right with many URLs", async () => {
      const result = await appController.evaluation(
        Array.from(Array(30).keys()).map((i) => `url${i}`),
      );
      expect(result).toStrictEqual(mockResultMultiUrl);
    });
  });
});
