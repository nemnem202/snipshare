import { describe, expect, it } from "vitest";
import request from "supertest";
import routesTests from "./routes-test-arrays.ts";
import app from "../server/runtime/app.ts";

describe("[Routes Behavior]", () => {
  const agent = request.agent(app);

  for (const routesTest of routesTests) {
    for (const test of routesTest) {
      it(`[ ${test.url} ] ${test.description}`, async () => {
        const client = test.useAgent ? agent : request(app);

        if (test.setupAgent && test.useAgent) {
          await test.setupAgent(agent);
        }

        let req = client[test.method](test.url);

        if (test.body) {
          req = req.send(test.body);
        }

        const res = await req;

        if (test.expectedStatus) {
          expect(res.status).toBe(test.expectedStatus);
        }

        if (test.expectedBody) {
          expect(res.body).toEqual(test.expectedBody);
        }

        if (test.expectedCookie) {
          const setCookieHeader = res.headers["set-cookie"];

          const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

          expect(cookies).toBeDefined();
          expect(cookies.some((c) => c.includes("session"))).toBe(true);
        }
      });
    }
  }
});
