import express from "express";
import AuthController from "../controllers/auth.controller.js";
import type { Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { prisma } from "../../lib/prisma.js";
import AuthService from "../services/auth.service.js";

const router = express.Router();
const authService = new AuthService(prisma);
const authController = new AuthController(authService);

router.post("/", authMiddleware, (req: Request, res: Response) =>
  authController.userLogin(req, res),
);

export default router;
