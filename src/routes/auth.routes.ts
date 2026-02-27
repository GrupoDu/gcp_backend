import express from "express";
import AuthController from "../controllers/auth.controller.ts";
import type { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { prisma } from "../../lib/prisma.ts";
import AuthService from "../services/auth.service.ts";
import accessTokenMiddleware from "../middlewares/accessToken.middleware.ts";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.ts";

const router: Router = express.Router();
const authService = new AuthService(prisma);
const authController = new AuthController(authService);

router.post("/", authMiddleware, (req: Request, res: Response) =>
  authController.userLogin(req, res),
);
router.post("/refresh", (req: Request, res: Response) =>
  authController.refresh(req, res),
);
router.get("/verify", accessTokenMiddleware, (req: Request, res: Response) =>
  authController.isTokenStillValid(req, res),
);
router.post(
  "/logout",
  getTokenMiddleware,
  accessTokenMiddleware,
  (req: Request, res: Response) => authController.userLogout(req, res),
);

export default router;
