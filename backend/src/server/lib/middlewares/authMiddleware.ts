import { NextFunction, Request, Response } from "express";
import CookieParser from "./cookieParser";
import { ServerResponse } from "../../types/global/response";

export default class AuthMiddleware {
  static protectUser = async (req: Request, res: Response<ServerResponse>, next: NextFunction) => {
    const session = await CookieParser.getSession(req);
    if (session) return next();
    return res.json({
      message: "Cannot access to this feature yet, try to anthenticate !",
      success: false,
      redirect: "/login",
    });
  };
}
