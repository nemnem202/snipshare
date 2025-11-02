import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { Prisma, PrismaClient, UserAccount } from "../generated/prisma";
import { faker } from "@faker-js/faker";
import { configDotenv } from "dotenv";

configDotenv();

const prisma = new PrismaClient();

const users: Prisma.UserAccountCreateInput[] = Array.from({ length: 10 }).map(() => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: faker.internet.password(),
}));

const db_users: UserAccount[] = [];

describe("Database", async () => {
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }

    await prisma.userAccount.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("env database url should be defined", () => {
    expect(process.env.DATABASE_URL).toBeTypeOf("string");
  });

  const nmbr_of_users_before = await prisma.userAccount.count();

  users.forEach((u, index) => {
    it(`should create and validate user ${index + 1}`, async () => {
      const user = await prisma.userAccount.create({ data: u });
      db_users.push(user);
      expect(user.id).toBeTypeOf("number");
      expect(user.username).toBe(u.username);
      expect(user.email).toBe(u.email);
      expect(user.password).toBe(u.password);
    });
  });

  it("should remove all of the precedently created users", async () => {
    for (const u of db_users) {
      await prisma.userAccount.delete({ where: { id: u.id } });
    }

    const nmbr_of_users_after = await prisma.userAccount.count();
    expect(nmbr_of_users_after).toEqual(nmbr_of_users_before);
  });
});
