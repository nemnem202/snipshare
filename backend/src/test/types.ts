import TestAgent from "supertest/lib/agent";
import { ServerResponse } from "../server/types/global/response";

export type RouteTest = {
  description: string;
  method: "get" | "post" | "put" | "delete";
  url: string;
  expectedStatus?: number;
  body?: object;
  expectedBody?: ServerResponse;
  useAgent?: boolean; // indique si on doit utiliser un agent (auth)
  setupAgent?: (agent: TestAgent) => Promise<void> | void; // pour login etc.
};
