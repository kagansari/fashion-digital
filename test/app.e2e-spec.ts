import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import {
  getAxiosMockFileStream,
  mockResultMultiUrl,
  mockResultSingleUrl,
} from "./helpers";

jest.mock("axios");

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    axios.get.mockImplementation(getAxiosMockFileStream);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [],
    }).compile();

    app = moduleFixture.createNestApplication({});

    await app.init();
  });

  it("should calculate right with single URL", () => {
    return request(app.getHttpServer())
      .get("/evaluation?url=url1")
      .expect(200)
      .expect(mockResultSingleUrl);
  });

  it("should calculate right with multiple URLs", () => {
    return request(app.getHttpServer())
      .get("/evaluation?url=url1&url=url2")
      .expect(200)
      .expect(mockResultMultiUrl);
  });
});
