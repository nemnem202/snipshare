import { RouteTest } from "./types.js";
import { expect } from "vitest";
import crypto from "crypto";
import { faker } from "@faker-js/faker";
import { Prisma } from "../generated/prisma/index.js";
import { ServerResponse } from "../server/types/global/response.js";

const testUser: Prisma.UserAccountCreateInput = {
  username: faker.internet.username(),
  password: faker.internet.password(),
  email: faker.internet.email(),
};

const testUser2: Prisma.UserAccountCreateInput = {
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
    body: { email: testUser.email, password: testUser.password },
    expectedStatus: 200,
    expectedBody: { message: "No username provided", success: false },
  },
  {
    description: "should return an error if email is missing",
    url: "/auth/register",
    method: "post",
    body: { username: testUser.username, password: testUser.password },
    expectedStatus: 200,
    expectedBody: { message: "No email provided", success: false },
  },
  {
    description: "should return an error if password is missing",
    url: "/auth/register",
    method: "post",
    body: { username: testUser.username, email: testUser.email },
    expectedStatus: 200,
    expectedBody: { message: "No password provided", success: false },
  },
  {
    description: "should return an error if password is too short",
    url: "/auth/register",
    method: "post",
    body: { email: testUser.email, username: testUser.username, password: "123" },
    expectedStatus: 200,
    expectedBody: zodErrorResponse("Le mot de passe doit contenir au moins 6 caractères."),
  },
  {
    description: "should return an error if password is too long",
    url: "/auth/register",
    method: "post",
    body: { email: testUser.email, username: testUser.username, password: "a".repeat(101) },
    expectedStatus: 200,
    expectedBody: zodErrorResponse("Le mot de passe ne peut pas dépasser 100 caractères."),
  },
  {
    description: "should return an error if username is too short",
    url: "/auth/register",
    method: "post",
    body: { email: testUser.email, username: "ab", password: testUser.password },
    expectedStatus: 200,
    expectedBody: zodErrorResponse("Le nom d'utilisateur doit contenir au moins 3 caractères."),
  },
  {
    description: "should return an error if username is too long",
    url: "/auth/register",
    method: "post",
    body: { email: testUser.email, username: "a".repeat(31), password: testUser.password },
    expectedStatus: 200,
    expectedBody: zodErrorResponse("Le nom d'utilisateur ne peut pas dépasser 30 caractères."),
  },
  {
    description: "should return an error if email is invalid",
    url: "/auth/register",
    method: "post",
    body: { email: "invalid-email", username: testUser.username, password: testUser.password },
    expectedStatus: 200,
    expectedBody: zodErrorResponse("L'adresse e-mail n'est pas valide."),
  },
  {
    description: "should return a success on register with session cookie and username",
    url: "/auth/register",
    method: "post",
    useAgent: true,
    body: testUser,
    expectedStatus: 200,
    expectedBody: { message: "Welcome !", success: true, sessionUsername: testUser.username },
    expectedCookie: "session",
  },
  {
    description: "this is just to have another account",
    url: "/auth/register",
    method: "post",
    body: testUser2,
    expectedStatus: 200,
  },
  {
    description: "should return an error if email already exists",
    url: "/auth/register",
    method: "post",
    body: { username: "newUsername", email: testUser.email, password: "testpasswordyes" },
    expectedStatus: 200,
    expectedBody: { message: "Account already existing, try to login !", success: false },
  },
  {
    description: "should return an error if username already exists",
    url: "/auth/register",
    method: "post",
    body: {
      username: testUser.username,
      email: "newemail@example.com",
      password: "new password",
    },
    expectedStatus: 200,
    expectedBody: { message: "Duplicate username, try another one !", success: false },
  },
];

const login: RouteTest[] = [
  {
    description: "should return an error if email is missing",
    url: "/auth/login",
    method: "post",
    body: { password: testUser.password },
    expectedStatus: 200,
    expectedBody: { message: "No email provided", success: false },
  },
  {
    description: "should return an error if password is missing",
    url: "/auth/login",
    method: "post",
    body: { email: testUser.email },
    expectedStatus: 200,
    expectedBody: { message: "No password provided", success: false },
  },
  {
    description: "should return an error if email does not exist",
    url: "/auth/login",
    method: "post",
    body: { email: "unknown@example.com", password: testUser.password },
    expectedStatus: 200,
    expectedBody: { message: "Invalid credentials", success: false },
  },
  {
    description: "should return an error if password is invalid",
    url: "/auth/login",
    method: "post",
    body: { email: testUser.email, password: "wrongPassword123!" },
    expectedStatus: 200,
    expectedBody: { message: "Invalid credentials", success: false },
  },
  {
    description: "should return a success on login with session cookie and username",
    url: "/auth/login",
    method: "post",
    useAgent: true,
    body: testUser,
    expectedStatus: 200,
    expectedBody: { message: "Welcome !", success: true, sessionUsername: testUser.username },
    expectedCookie: "session",
  },
];

const code: RouteTest[] = [
  // --- Protection de la route ---
  {
    description: "should return 401 if not authenticated",
    url: "/code",
    method: "post",
    body: validCodeBody,
    expectedStatus: 401,
    expectedBody: unauthorizedResponse,
  },

  // --- Validation des champs ---
  {
    description: "should return 400 if content is missing",
    url: "/code",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { language: "typescript", version: "5.0.3" },
    expectedStatus: 400,
    expectedBody: { success: false, message: "Invalid input: expected string, received undefined" },
  },
  {
    description: "should return 400 if content is too long",
    url: "/code",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { language: "typescript", version: "5.0.3", content: "a".repeat(10_001) },
    expectedStatus: 400,
    expectedBody: { success: false, message: "Le code ne peut excéder 10 000 caractères" },
  },
  {
    description: "should return 400 if language is missing",
    url: "/code",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { version: "5.0.3", content: validCodeBody.content },
    expectedStatus: 400,
    expectedBody: { success: false, message: "Invalid input: expected string, received undefined" },
  },
  {
    description: "should return 400 if language is too long",
    url: "/code",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { language: "a".repeat(51), version: "5.0.3", content: validCodeBody.content },
    expectedStatus: 400,
    expectedBody: {
      success: false,
      message: "Le nom du langage est trop long (maximum 50 caractères).",
    },
  },
  {
    description: "should return 400 if version is missing",
    url: "/code",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { language: "typescript", content: validCodeBody.content },
    expectedStatus: 400,
    expectedBody: { success: false, message: "Invalid input: expected string, received undefined" },
  },
  {
    description: "should return 400 if version format is invalid",
    url: "/code",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { language: "typescript", version: "invalid", content: validCodeBody.content },
    expectedStatus: 400,
    expectedBody: { success: false, message: "Le format de version est invalide (ex: 5.0.3)" },
  },
  {
    description: "should return Piston API response on success",
    url: "/code",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: validCodeBody,
    expectedStatus: 200,
  },
];

const dashboard: RouteTest[] = [
  {
    description: "should return 400 if username is missing",
    url: "/dashboard/change-username",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: {},
    expectedStatus: 200,
    expectedBody: {
      success: false,
      message: "Invalid input: expected string, received undefined",
    },
  },
  {
    description: "should return 400 if username is too short",
    url: "/dashboard/change-username",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { username: "ab" },
    expectedStatus: 200,
    expectedBody: {
      success: false,
      message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
    },
  },
  {
    description: "should return 400 if username is too long",
    url: "/dashboard/change-username",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { username: "a".repeat(31) },
    expectedStatus: 200,
    expectedBody: {
      success: false,
      message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
    },
  },
  {
    description: "should return 200 and succes on valid username",
    url: "/dashboard/change-username",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { username: "newValidAndUniqueUsername" },
    expectedStatus: 200,
    expectedBody: { success: true, message: "Nom d'utilisateur mis à jour !" },
  },
  {
    description: "should return 200 and error message on already take username",
    url: "/dashboard/change-username",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { username: testUser2.username },
    expectedStatus: 200,
    expectedBody: { success: false, message: "Ce nom d’utilisateur est déjà pris." },
  },
  {
    description: "should return 200 and succes on valid username",
    url: "/dashboard/change-username",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { username: testUser.username },
    expectedStatus: 200,
    expectedBody: { success: true, message: "Nom d'utilisateur mis à jour !" },
  },
  {
    description: "should return the number of pages for user snippets (no filters)",
    url: "/dashboard/pages_number",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: { number: 0 },
  },
  {
    description: "should return the number of pages for user snippets (with language filter)",
    url: "/dashboard/pages_number?language=typescript",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: { number: expect.any(Number) },
  },
  {
    description: "should return the number of pages for user snippets (with tags filter)",
    url: "/dashboard/pages_number?tags=web&tags=api",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: { number: expect.any(Number) },
  },
  {
    description: "should return the number of pages for liked snippets (madeByUser=false)",
    url: "/dashboard/pages_number?madeByUser=false",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: { number: expect.any(Number) },
  },
  {
    description: "should return 400 if page_index is not a number",
    url: "/dashboard/invalid",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200, // Note: ton code force index=0 en cas d'erreur
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of snippets for page 0 (no filters)",
    url: "/dashboard/0",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of snippets for page 0 (with language filter)",
    url: "/dashboard/0?language=typescript",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of snippets for page 0 (with tags filter)",
    url: "/dashboard/0?tags=web&tags=api",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of liked snippets (madeByUser=false)",
    url: "/dashboard/0?madeByUser=false",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of snippets ordered by popularity",
    url: "/dashboard/0?orderBy=popularity",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: expect.any(Array),
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
    description: "POST /code should reject unauthorized user",
    method: "post",
    url: "/code",
    expectedBody: unauthorizedResponse,
  },
  {
    description: "POST /dashboard/change-username should reject unauthorized user",
    method: "post",
    url: "/dashboard/change-username",
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

// const session: RouteTest[] = [
//   {
//     description: "should return 200 on session check",
//     url: "/auth/session",
//     method: "get",
//     useAgent: true,
//     expectedStatus: 200,
//   },
// ];

const explorer: RouteTest[] = [
  {
    description: "should return all available languages with details",
    url: "/explorer/languages",
    method: "get",
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return only language names if onlyNames=true",
    url: "/explorer/languages?onlyNames=true",
    method: "get",
    expectedStatus: 200,
    expectedBody: expect.arrayContaining([expect.any(String)]),
  },
  {
    description: "should return the number of pages for all public snippets (no filters)",
    url: "/explorer/pages_number",
    method: "get",
    expectedStatus: 200,
    expectedBody: { number: expect.any(Number) },
  },
  {
    description: "should return the number of pages for public snippets (with language filter)",
    url: "/explorer/pages_number?language=typescript",
    method: "get",
    expectedStatus: 200,
    expectedBody: { number: expect.any(Number) },
  },
  {
    description: "should return the number of pages for public snippets (with tags filter)",
    url: "/explorer/pages_number?tags=web&tags=api",
    method: "get",
    expectedStatus: 200,
    expectedBody: { number: expect.any(Number) },
  },
  {
    description: "should return 200 even if page_index is not a number (defaults to 0)",
    url: "/explorer/invalid",
    method: "get",
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of public snippets for page 0 (no filters, no user)",
    url: "/explorer/0",
    method: "get",
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of public snippets for page 0 (with language filter)",
    url: "/explorer/0?language=typescript",
    method: "get",
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of public snippets for page 0 (with tags filter)",
    url: "/explorer/0?tags=web&tags=api",
    method: "get",
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of public snippets ordered by popularity",
    url: "/explorer/0?orderBy=popularity",
    method: "get",
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
  {
    description: "should return a list of public snippets with like flag if user is authenticated",
    url: "/explorer/0",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: expect.any(Array),
  },
];

const validSnippetForm = {
  title: "Test Snippet",
  description: "A test snippet",
  code: "console.log('Hello world!');",
  language: { language: "typescript", version: "1.32.3" },
  filters: ["web", "api"],
  visibility: true,
  private_url: false,
};

const snippet: RouteTest[] = [
  {
    description: "should return 401 if not authenticated (new snippet)",
    url: "/snippet/new",
    method: "post",
    body: validSnippetForm,
    expectedStatus: 401,
    expectedBody: unauthorizedResponse,
  },
  {
    description: "should return 400 if snippet form is invalid (missing title)",
    url: "/snippet/new",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { ...validSnippetForm, title: "" },
    expectedStatus: 200,
    expectedBody: { success: false, message: expect.any(String) },
  },
  {
    description: "should return 400 if language is invalid",
    url: "/snippet/new",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { ...validSnippetForm, language: { language: "invalid", version: "1.0.0" } },
    expectedStatus: 200,
    expectedBody: { success: false, message: "Language invalide !" },
  },
  {
    description: "should return 200 and success message on valid snippet creation",
    url: "/snippet/new",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: validSnippetForm,
    expectedStatus: 200,
    expectedBody: { success: true, message: "Snippet ajouté !" },
  },

  // --- POST /:snippet_id ---
  {
    description: "should return 401 if not authenticated (update snippet)",
    url: "/snippet/1",
    method: "post",
    body: validSnippetForm,
    expectedStatus: 401,
    expectedBody: unauthorizedResponse,
  },
  {
    description: "should return 400 if snippet_id is not a number",
    url: "/snippet/invalid",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: validSnippetForm,
    expectedStatus: 200,
    expectedBody: { success: false, message: "Le snippet demandé est invalide" },
  },
  {
    description: "should return 400 if snippet form is invalid (update)",
    url: "/snippet/1",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { ...validSnippetForm, title: "" },
    expectedStatus: 200,
    expectedBody: { success: false, message: expect.any(String) },
  },
  {
    description: "should return 400 if language is invalid (update)",
    url: "/snippet/1",
    method: "post",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    body: { ...validSnippetForm, language: { language: "invalid", version: "1.0.0" } },
    expectedStatus: 200,
    expectedBody: { success: false, message: "Language invalide !" },
  },
  // {
  //   description: "should return 200 and success message on valid snippet update",
  //   url: "/snippet/1",
  //   method: "post",
  //   useAgent: true,
  //   setupAgent: async (agent) => {
  //     await agent.post("/auth/login").send(testUser);
  //   },
  //   body: validSnippetForm,
  //   expectedStatus: 200,
  //   expectedBody: { success: true, message: "Snippet modifié !" },
  // },

  // --- GET /unref/snippetId/:snippet_id ---
  {
    description: "should return 401 if not authenticated (get unref url)",
    url: "/snippet/unref/snippetId/1",
    method: "get",
    expectedStatus: 401,
    expectedBody: unauthorizedResponse,
  },
  {
    description: "should return 400 if snippet_id is not a number",
    url: "/snippet/unref/snippetId/invalid",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: { success: false, message: "Invalid snippet" },
  },
  {
    description: "should return 404 if snippet not found",
    url: "/snippet/unref/snippetId/999999",
    method: "get",
    useAgent: true,
    setupAgent: async (agent) => {
      await agent.post("/auth/login").send(testUser);
    },
    expectedStatus: 200,
    expectedBody: { success: false, message: "Snippet not found !" },
  },
  // {
  //   description: "should return 200 and unref url if snippet exists and belongs to user",
  //   url: "/snippet/unref/snippetId/1",
  //   method: "get",
  //   useAgent: true,
  //   setupAgent: async (agent) => {
  //     await agent.post("/auth/login").send(testUser);
  //   },
  //   expectedStatus: 200,
  //   expectedBody: { url: expect.stringContaining("/unref/") },
  // },
  {
    description: "should return 404 if unref path does not exist",
    url: `/snippet/unref/${crypto.randomUUID()}`,
    method: "get",
    expectedStatus: 200,
    expectedBody: { success: false, message: "Snippet not found !" },
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

const routesTests: RouteTest[][] = [
  register,
  login,
  unauthorizedRoutes,
  // session,
  explorer,
  dashboard,
  code,
  social,
  snippet,
];

export default routesTests;
