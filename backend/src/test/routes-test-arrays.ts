import { RouteTest } from "./types.js";
import crypto from "crypto";
import { faker } from "@faker-js/faker";
import { Prisma } from "../generated/prisma/index.js";

const testUser: Prisma.UserAccountCreateInput = {
  username: faker.internet.username(),
  password: faker.internet.password(),
  email: faker.internet.email(),
};

const auth: RouteTest[] = [
  {
    description: "should return a success on register",
    url: "/auth/register",
    method: "post",
    body: testUser,
    expectedBody: {
      message: "Welcome !",
      success: true,
    },
  },
  {
    description: "should return an error if password is too short",
    url: "/auth/register",
    method: "post",
    body: {
      email: testUser.email,
      username: testUser.username,
      password: faker.internet.password({ length: 2 }),
    },
    expectedBody: {
      message: "Le mot de passe doit contenir au moins 6 caractères.",
      success: false,
    },
  },
  {
    description: "should return an error if password is too long",
    url: "/auth/register",
    method: "post",
    body: {
      email: testUser.email,
      username: testUser.username,
      password: faker.internet.password({ length: 101 }),
    },
    expectedBody: {
      message: "Le mot de passe ne peut pas dépasser 100 caractères.",
      success: false,
    },
  },
  {
    description: "should return an error if username is too short",
    url: "/auth/register",
    method: "post",
    body: {
      email: testUser.email,
      username: "ab",
      password: testUser.password,
    },
    expectedBody: {
      message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
      success: false,
    },
  },
  {
    description: "should return an error if username is too long",
    url: "/auth/register",
    method: "post",
    body: {
      email: testUser.email,
      username: "a".repeat(31),
      password: testUser.password,
    },
    expectedBody: {
      message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
      success: false,
    },
  },
  {
    description: "should return an error if email is invalid",
    url: "/auth/register",
    method: "post",
    body: {
      email: "invalid-email",
      username: testUser.username,
      password: testUser.password,
    },
    expectedBody: {
      message: "L'adresse e-mail n'est pas valide.",
      success: false,
    },
  },
  {
    description: "should return 200 on login",
    url: "/auth/login",
    method: "post",
    expectedStatus: 200,
  },
  {
    description: "should return 200 on session check",
    url: "/auth/session",
    method: "get",
    expectedStatus: 200,
  },
];

const explorer: RouteTest[] = [
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
];

const dashboard: RouteTest[] = [
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
];

const code: RouteTest[] = [
  {
    description: "should return 200 on code post",
    url: "/code",
    method: "post",
    expectedStatus: 200,
  },
];

const social: RouteTest[] = [
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
];

const snippet: RouteTest[] = [
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

const routesTests: RouteTest[][] = [auth, explorer, dashboard, code, social, snippet];

export default routesTests;
