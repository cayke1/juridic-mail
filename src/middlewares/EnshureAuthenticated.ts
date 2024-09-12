import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/CreateCustomError";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt";

export default function enshureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void | Error | Response {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError("Auth token not sent"));
  }

  const [, token] = authHeader.split(" ");

  try {
    jwt.verify(token, jwtConfig.secret);

    return next();
  } catch (error) {
    return next(new UnauthorizedError("Auth token not valid"));
  }
}
