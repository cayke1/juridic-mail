import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
const authRoutes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.register);
authRoutes.get("/verify", authController.verifyToken);

export { authRoutes };