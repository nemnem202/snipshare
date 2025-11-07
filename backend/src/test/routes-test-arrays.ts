import { RouteTest } from "./types.js";
import crypto from "crypto";
import { faker } from "@faker-js/faker";
import { Prisma } from "../generated/prisma/index.js";
import { ServerResponse } from "../server/types/global/response.js";

const testUser: Prisma.UserAccountCreateInput = {
  username: faker.internet.username(),
  password: faker.internet.password(),
  email: faker.internet.email(),
};

const unauthorizedResponse: ServerResponse = {
  message: "Cannot access to this feature yet, try to anthenticate !",
  success: false,
  redirect: "/login",
};

const validCodeBody = {
  language: "typescript",
  version: "5.0.3",
  content: "console.log('Hello world !')",
};

const zodErrorResponse = (message: string) => ({
  success: false,
  message,
});

const register: RouteTest[] = [
  {
    description: "should return an error if username is missing",
    url: "/auth/register",
    method: "post",
    body: {
      email: testUser.email,
      password: testUser.password,
    },
    expectedBody: {
      message: "No username provided",
      success: false,
    },
  },
  {
    description: "should return an error if email is missing",
    url: "/auth/register",
    method: "post",
    body: {
      username: testUser.username,
      password: testUser.password,
    },
    expectedBody: {
      message: "No email provided",
      success: false,
    },
  },
  {
    description: "should return an error if password is missing",
    url: "/auth/register",
    method: "post",
    body: {
      username: testUser.username,
      email: testUser.email,
    },
    expectedBody: {
      message: "No password provided",
      success: false,
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
    description: "should return a success on register",
    url: "/auth/register",
    method: "post",
    useAgent: true,
    body: testUser,
    expectedCookie: "session",
    expectedBody: {
      message: "Welcome !",
      success: true,
    },
  },
  {
    description: "should return an error if email already exists",
    url: "/auth/register",
    method: "post",
    body: {
      username: "newUsername",
      email: testUser.email,
      password: testUser.password,
    },
    expectedBody: {
      message: "Account already existing, try to login !",
      success: false,
    },
  },
  {
    description: "should return an error if username already exists",
    url: "/auth/register",
    method: "post",
    body: {
      username: testUser.username,
      email: "newemail@example.com",
      password: testUser.password,
    },
    expectedBody: {
      message: "Duplicate username, try another one !",
      success: false,
    },
  },
];

const login: RouteTest[] = [
  {
    description: "should return a success on login",
    url: "/auth/login",
    method: "post",
    useAgent: true,
    body: testUser,
    expectedBody: {
      message: "Welcome !",
      success: true,
    },
    expectedCookie: "session",
  },

  {
    description: "should return an error if email is missing",
    url: "/auth/login",
    method: "post",
    body: {
      password: testUser.password,
    },
    expectedBody: {
      message: "No email provided",
      success: false,
    },
  },

  {
    description: "should return an error if password is missing",
    url: "/auth/login",
    method: "post",
    body: {
      email: testUser.email,
    },
    expectedBody: {
      message: "No password provided",
      success: false,
    },
  },

  {
    description: "should return an error if email does not exist",
    url: "/auth/login",
    method: "post",
    body: {
      email: "unknown@example.com",
      password: testUser.password,
    },
    expectedBody: {
      message: "Invalid credentials",
      success: false,
    },
  },

  {
    description: "should return an error if password is invalid",
    url: "/auth/login",
    method: "post",
    body: {
      email: testUser.email,
      password: "wrongPassword123!",
    },
    expectedBody: {
      message: "Invalid credentials",
      success: false,
    },
  },

  {
    description: "should set a session cookie on login",
    url: "/auth/login",
    method: "post",
    useAgent: true,
    body: testUser,
    expectedBody: {
      message: "Welcome !",
      success: true,
    },
    expectedCookie: "session",
  },
];

const unauthorizedRoutes: RouteTest[] = [
  {
    description: "GET /auth/session should reject unauthorized user",
    method: "get",
    url: "/auth/session",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "DELETE /auth/session should reject unauthorized user",
    method: "delete",
    url: "/auth/session",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "DELETE /auth/account should reject unauthorized user",
    method: "delete",
    url: "/auth/account",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "POST /code should reject unauthorized user",
    method: "post",
    url: "/code",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "PUT /dashboard/change-username/:id should reject unauthorized user",
    method: "put",
    url: "/dashboard/change-username/1",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "GET /dashboard/liked/pages_number should reject unauthorized user",
    method: "get",
    url: "/dashboard/liked/pages_number",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "GET /dashboard/personals/pages_number should reject unauthorized user",
    method: "get",
    url: "/dashboard/personals/pages_number",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "GET /dashboard/liked/:page should reject unauthorized user",
    method: "get",
    url: "/dashboard/liked/1",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "GET /dashboard/personals/:page should reject unauthorized user",
    method: "get",
    url: "/dashboard/personals/1",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "POST /snippet/new should reject unauthorized user",
    method: "post",
    url: "/snippet/new",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "POST /social/comment/:snippet_id should reject unauthorized user",
    method: "post",
    url: "/social/comment/123",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "GET /social/like/:snippet_id should reject unauthorized user",
    method: "get",
    url: "/social/like/456",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "GET /social/unlike/:snippet_id should reject unauthorized user",
    method: "get",
    url: "/social/unlike/789",
    expectedBody: unauthorizedResponse,
  },
];

const session: RouteTest[] = [
  {
    description: "should return 200 on session check",
    url: "/auth/session",
    method: "get",
    useAgent: true,
    expectedStatus: 200,
  },
];

const explorer: RouteTest[] = [
  {
    description: "should return 200 on explorer root",
    url: "/explorer/1",
    method: "get",
    expectedStatus: 200,
  },
  {
    description: "should return 200 on explorer pages_number",
    url: "/explorer/pages_number",
    method: "get",
    expectedStatus: 200,
  },
  // {
  //   description: "should return 200 on explorer comments with random UUID",
  //   url: `/explorer/comments/${crypto.randomUUID()}`,
  //   method: "get",
  //   expectedStatus: 200,
  // },
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
    description: "should return 200 on pages_number",
    url: "/dashboard/pages_number",
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },
  {
    description: "should return 200 on page",
    url: `/dashboard/${crypto.randomUUID()}`,
    method: "get",
    expectedStatus: 200,
    useAgent: true,
  },
];

const code: RouteTest[] = [
  {
    description: "Doit exécuter le code correctement",
    url: "/code",
    method: "post",
    useAgent: true,
    body: validCodeBody,
    expectedStatus: 200,
  },
  {
    description: "Doit échouer si le code est vide",
    url: "/code",
    method: "post",
    useAgent: true,
    body: { ...validCodeBody, content: "" },
    expectedStatus: 400,
    expectedBody: zodErrorResponse("Le code ne peut pas être vide"),
  },
  {
    description: "Doit échouer si le code dépasse 10 000 caractères",
    url: "/code",
    method: "post",
    useAgent: true,
    body: { ...validCodeBody, content: "a".repeat(10_001) },
    expectedStatus: 400,
    expectedBody: zodErrorResponse("Le code ne peut excéder 10 000 caractères"),
  },
  {
    description: "Doit échouer si le langage est vide",
    url: "/code",
    method: "post",
    useAgent: true,
    body: { ...validCodeBody, language: "" },
    expectedStatus: 400,
    expectedBody: zodErrorResponse("Le nom du langage ne peut pas être vide."),
  },
  {
    description: "Doit échouer si le langage dépasse 50 caractères",
    url: "/code",
    method: "post",
    useAgent: true,
    body: { ...validCodeBody, language: "a".repeat(51) },
    expectedStatus: 400,
    expectedBody: zodErrorResponse("Le nom du langage est trop long (maximum 50 caractères)."),
  },
  {
    description: "Doit échouer si la version n'est pas au format X.Y.Z",
    url: "/code",
    method: "post",
    useAgent: true,
    body: { ...validCodeBody, version: "abc" },
    expectedStatus: 400,
    expectedBody: zodErrorResponse("Le format de version est invalide (ex: 5.0.3)"),
  },
  {
    description: "Doit échouer si le body est incomplet",
    url: "/code",
    method: "post",
    useAgent: true,
    body: { ...validCodeBody, content: "" }, // Manque content + version
    expectedStatus: 400,
    expectedBody: zodErrorResponse("Le code ne peut pas être vide"),
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

const routesTests: RouteTest[][] = [
  register,
  login,
  unauthorizedRoutes,
  session,
  explorer,
  dashboard,
  code,
  social,
  snippet,
];

export default routesTests;
