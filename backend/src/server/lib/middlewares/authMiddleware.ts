import { NextFunction, Request, Response } from "express";
import CookieParser from "./cookieParser";
import { ServerResponse } from "../../types/global/response";

declare module "express" {
  interface Request {
    userId?: number;
  }
}

export default class AuthMiddleware {
  static protectUser = async (req: Request, res: Response<ServerResponse>, next: NextFunction) => {
    const session = await CookieParser.getSession(req);
    if (session) {
      req.userId = session;
      return next();
    }
    return res.status(401).json({
      message: "Cannot access to this feature yet, try to anthenticate !",
      success: false,
      redirect: "/login",
    });
  };
}
