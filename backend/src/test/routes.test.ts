import { describe, expect, it } from "vitest";
import request from "supertest";
import routesTests from "./tests.js";
import app from "../core/app.js";

describe("[Routes Behavior]", async () => {
  const agent = request.agent(app);

  for (const test of routesTests) {
    it(`[ ${test.url} ] ${test.description}`, async () => {
      const req = test.useAgent ? agent : request(app);

      if (test.setupAgent && test.useAgent) {
        await test.setupAgent(agent); // ex: login
      }

      const res = await req[test.method](test.url);

      expect(res.status).toBe(test.expectedStatus);

      if (test.expectedBody) {
        expect(res.body).toEqual(test.expectedBody);
      } else if (test.expectedBodyType) {
        const body = res.body;
        const type = Array.isArray(body) ? "array" : body === null ? "null" : typeof body;
        expect(type).toBe(test.expectedBodyType);
      }
    });
  }
});
