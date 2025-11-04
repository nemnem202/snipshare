import { describe, expect, it } from "vitest";
import request from "supertest";
import routesTests from "./routes-test-arrays.ts";
import app from "../server/runtime/app.ts";

describe("[Routes Behavior]", async () => {
  const agent = request.agent(app);

  for (const routesTest of routesTests) {
    for (const test of routesTest) {
      it(`[ ${test.url} ] ${test.description}`, async () => {
        const req = test.useAgent ? agent : request(app);

        if (test.setupAgent && test.useAgent) {
          await test.setupAgent(agent); // ex: login
        }

        let requestBuilder = req[test.method](test.url);

        if (test.body) {
          requestBuilder = requestBuilder.send(test.body);
        }

        const res = await requestBuilder;

        if (test.expectedStatus) {
          expect(res.status).toBe(test.expectedStatus);
        }

        if (test.expectedBody) {
          expect(res.body).toEqual(test.expectedBody);
        }
      });
    }
  }
});
