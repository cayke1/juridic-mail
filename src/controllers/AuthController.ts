import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { BadRequestError } from "../errors/CreateCustomError";
import { env } from "../utils/env";

export class AuthController {
  constructor(private userService: UserService) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(new BadRequestError("Missing info"));

    const user = {
      name,
      email,
      password,
      created_at: new Date(Date.now()),
    };
    const newUser = await this.userService.signup(user);

    if (newUser instanceof Error) {
      return next(newUser);
    }

    return res.status(201).json(newUser);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new BadRequestError("Email or password not sent"));
    const response = await this.userService.singin({ email, password });

    if (response instanceof Error) {
      return next(response);
    }

    return res.status(200).json(response);
  }

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next(new BadRequestError("Auth token not sent"));

    const decoded = await this.userService.verify(token, env.JWT_SECRET);
    if (decoded instanceof Error) return next(decoded);
    return res.status(200).json(decoded);
  }
}