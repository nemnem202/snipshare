import TestAgent from "supertest/lib/agent";

export type RouteTest = {
  description: string;
  method: "get" | "post" | "put" | "delete";
  url: string;
  expectedStatus: number;
  expectedBody?: unknown;
  expectedBodyType?: "object" | "array" | "string" | "number" | "boolean" | "null";
  useAgent?: boolean; // indique si on doit utiliser un agent (auth)
  setupAgent?: (agent: TestAgent) => Promise<void> | void; // pour login etc.
};
