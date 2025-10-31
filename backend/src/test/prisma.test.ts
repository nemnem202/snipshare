import { describe, expect, it } from "vitest";
import { Prisma, PrismaClient, UserAccount } from "../generated/prisma";
import {faker} from '@faker-js/faker'

const prisma = new PrismaClient()

  const users: Prisma.UserAccountCreateInput[] = Array.from({ length: 10 }).map(() => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }));



describe("Database", async()=>{
                for (const [index,u ]of users.entries()) {
                const user = await prisma.userAccount.create({data: u});
                const userwithoutId: Prisma.UserAccountCreateInput={
                    email: user.email,
                    password:user.password,
                    username:user.username,
                }
                const userArray = {
                    email: users[index].email,
                    password:users[index].password,
                    username:users[index].username,
                } 
                     it("should be a valid user",  async()=>{

                        expect(userArray== userwithoutId).toBe(true)
                        expect(user.id )
    })
            }

})