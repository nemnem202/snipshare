import { RouteTest } from "./types";
import crypto from "crypto";

const routesTests: RouteTest[] = [
  {
    description: "should return 200 on login",
    url: "/auth/login",
    method: "post",
    expectedStatus: 200,
  },
  {
    description: "should return 200 on register",
    url: "/auth/register",
    method: "post",
    expectedStatus: 200,
  },
  {
    description: "should return 200 on session check",
    url: "/auth/session",
    method: "get",
    expectedStatus: 200,
  },

  {
    description: "should return 200 on explorer root",
    url: "/explorer",
    method: "get",
    expectedStatus: 200,
  },
  {
    description: "should return 200 on explorer pages_number",
    url: "/explorer/pages_number",
    method: "get",
    expectedStatus: 200,
  },
  {
    description: "should return 200 on explorer comments with random UUID",
    url: `/explorer/comments/${crypto.randomUUID()}`,
    method: "get",
    expectedStatus: 200,
  },

  {
    description: "should return 200 on code post",
    url: "/code",
    method: "post",
    expectedStatus: 200,
  },

  {
    description: "should return 200 on change-username",
    url: `/dashboard/change-username/${crypto.randomUUID()}`,
    method: "put",
    expectedStatus: 200,
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send({ user: "test", password: "test" });
    },
  },
  {
    description: "should return 200 on liked pages_number",
    url: "/dashboard/liked/pages_number",
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },
  {
    description: "should return 200 on personals pages_number",
    url: "/dashboard/personals/pages_number",
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },
  {
    description: "should return 200 on liked page",
    url: `/dashboard/liked/${crypto.randomUUID()}`,
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },
  {
    description: "should return 200 on personals page",
    url: `/dashboard/personals/${crypto.randomUUID()}`,
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },

  {
    description: "should return 200 on comment post",
    url: `/social/comment/${crypto.randomUUID()}`,
    method: "post",
    expectedStatus: 200,
    useAgent: true,
  },
  {
    description: "should return 200 on like get",
    url: `/social/like/${crypto.randomUUID()}`,
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },
  {
    description: "should return 200 on unlike get",
    url: `/social/unlike/${crypto.randomUUID()}`,
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },

  {
    description: "should return 200 on snippet new",
    url: "/snippet/new",
    method: "post",
    expectedStatus: 200,
    useAgent: true,
  },
  {
    description: "should return 200 on snippet update",
    url: `/snippet/${crypto.randomUUID()}`,
    method: "put",
    expectedStatus: 200,
    useAgent: true,
  },
  {
    description: "should return 200 on snippet unref",
    url: `/snippet/unref/${crypto.randomUUID()}`,
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },
];

export default routesTests;
