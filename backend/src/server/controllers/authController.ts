import { Request, Response } from "express";
import { ServerResponse } from "../types/global/response";
import SchemaParser from "../lib/middlewares/schemaParser";
import { ZodError } from "zod";
import prisma from "../runtime/prisma";
import { Custom } from "../lib/tools/logger";
import argon2 from "argon2";
import CookieParser from "../lib/middlewares/cookieParser";

export default class AuthController {
  static register = async (
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

      const existingUserWithSameEmail = await prisma.userAccount.findFirst({
        where: {
          email: email,
        },
      });

      if (existingUserWithSameEmail) {
        return res.json({ message: "Account already existing, try to login !", success: false });
      }

      const existingUserWithSameUsername = await prisma.userAccount.findFirst({
        where: {
          username: username,
        },
      });

      if (existingUserWithSameUsername) {
        return res.json({ message: "Duplicate username, try another one !", success: false });
      }

      const parsedPassword = await argon2.hash(password);

      const user = await prisma.userAccount.create({
        data: { username, email, password: parsedPassword },
      });

      Custom.log("User creation");

      CookieParser.addSession(res, user.id);

      return res.json({ message: "Welcome !", success: true });
    } catch (err) {
      if (err instanceof ZodError) {
        const firstMessage = err.issues[0].message;
        return res.json({ success: false, message: firstMessage });
      }
      Custom.error("user create", err);
      return res.json({ message: "An internal error occured, please try again !", success: false });
    }
  };

  static login = async (
    req: Request,
    res: Response<ServerResponse>
  ): Promise<Response<ServerResponse>> => {
    try {
      const { email, password } = req.body;

      if (typeof email !== "string" || !email.trim()) {
        return res.json({ message: "No email provided", success: false });
      }
      if (typeof password !== "string" || !password.trim()) {
        return res.json({ message: "No password provided", success: false });
      }

      const user = await prisma.userAccount.findFirst({
        where: { email },
      });

      if (!user?.password) {
        return res.json({ message: "Invalid credentials", success: false });
      }

      let validPassword = false;
      try {
        validPassword = await argon2.verify(user.password, password);
      } catch (e) {
        Custom.warn("argon2.verify failed", e);
        return res.json({ message: "Invalid credentials", success: false });
      }

      if (!validPassword) {
        return res.json({ message: "Invalid credentials", success: false });
      }

      Custom.log("Login successful", { userId: user.id });

      CookieParser.addSession(res, user.id);

      return res.json({ message: "Welcome !", success: true });
    } catch (err) {
      Custom.error("Login route", err);
      return res.json({
        message: "An internal error occurred, please try again !",
        success: false,
      });
    }
  };
}
