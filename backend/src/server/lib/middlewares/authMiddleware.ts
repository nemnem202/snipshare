import { NextFunction, Request, Response } from "express";

export default class AuthMiddleware {
  static protectUser(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
