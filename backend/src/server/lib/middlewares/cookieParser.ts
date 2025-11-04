import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Custom } from "../tools/logger";
import { configDotenv } from "dotenv";

configDotenv();

export default class CookieParser {
  private static secret = process.env.JWT_SECRET;

  static addSession = (res: Response, id: number) => {
    if (!this.secret) {
      Custom.error("env", "jwt not defined. ");
      throw new Error();
    }
    const token = jwt.sign({ id: id }, this.secret);

    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: (Number(process.env.JWT_RT_TTL) || 6000) * 60 * 24,
    });
  };

  static getSession = async (req: Request): Promise<number | undefined> => {
    if (!req.cookies || !req.cookies.session) {
      return undefined;
    }

    const token = req.cookies.session;

    if (!token) {
      return undefined;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
      return payload.id;
    } catch (err) {
      return undefined;
    }
  };
}
