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

describe("Database", () => {
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not defined");

    // clean DB avant
    await prisma.userAccount.deleteMany();

    // créer les users avant les tests
    for (const u of users) {
      const user = await prisma.userAccount.create({ data: u });
      db_users.push(user);
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should have created all users", async () => {
    const count = await prisma.userAccount.count();
    expect(count).toEqual(users.length);
  });

  it("should remove all users", async () => {
    for (const u of db_users) {
      await prisma.userAccount.delete({ where: { id: u.id } });
    }

    const countAfter = await prisma.userAccount.count();
    expect(countAfter).toEqual(0);
  });
});
