import express from "express";
import AuthController from "../controllers/auth.controller.ts";
import type { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { prisma } from "../../lib/prisma.ts";
import AuthService from "../services/auth.service.ts";

const router: Router = express.Router();
const authService = new AuthService(prisma);
const authController = new AuthController(authService);

router.post("/", authMiddleware, (req: Request, res: Response) =>
  authController.userLogin(req, res),
);
router.post("/logout", (req: Request, res: Response) =>
  authController.userLogout(req, res),
);

export default router;
