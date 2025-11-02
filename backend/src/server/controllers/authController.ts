import { Request, Response } from "express";
import { ServerResponse } from "../types/global/response";
import SchemaParser from "../lib/middlewares/schemaParser";
import { ZodError } from "zod";
import prisma from "../runtime/prisma";
import { Custom } from "../lib/tools/logger";

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

      const user = await prisma.userAccount.create({ data: { username, email, password } });

      Custom.log("User", user);

      return res.json({ message: "Welcome !", success: true });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.json({ message: err.message, success: false });
      }
      return res.json({ message: "An internal error occured, please try again !", success: false });
    }
  };
}
