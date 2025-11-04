import { Request, Response } from "express";
import { ServerResponse } from "../types/global/response";
import SchemaParser from "../lib/middlewares/schemaParser";
import { ZodError } from "zod";
import prisma from "../runtime/prisma";
import { Custom } from "../lib/tools/logger";
import argon2 from "argon2";

export default class AuthController {
  static login = async (
    req: Request,
    res: Response<ServerResponse>
  ): Promise<Response<ServerResponse>> => {
    try {
      const { username, email, password } = req.body;

      if (!username) {
        return res.json({ message: "No username provided", success: false });
      }
      if (!email) {
        return res.json({ message: "No email provided", success: false });
      }
      if (!password) {
        return res.json({ message: "No password provided", success: false });
      }

      SchemaParser.UserAccount({ username, email, password });

      const parsedPassword = await argon2.hash(password);

      const user = await prisma.userAccount.create({
        data: { username, email, password: parsedPassword },
      });

      Custom.log("User creation", user);

      return res.json({ message: "Welcome !", success: true });
    } catch (err) {
      if (err instanceof ZodError) {
        const firstMessage = err.issues[0].message;
        return res.json({ success: false, message: firstMessage });
      }
      Custom.warn("user create", err);
      return res.json({ message: "An internal error occured, please try again !", success: false });
    }
  };
}
