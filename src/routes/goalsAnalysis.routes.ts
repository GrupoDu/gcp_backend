import express from "express";
import type { Request, Response, Router } from "express";
import GoalsAnalysisController from "../controllers/goalsAnalysis.controller.ts";
import GoalsAnalysisService from "../services/goalsAnalysis.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";

const router: Router = express.Router();
const goalsAnalysisService = new GoalsAnalysisService(prisma);
const goalsAnalysisController = new GoalsAnalysisController(
  goalsAnalysisService,
);

router.get(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) =>
    goalsAnalysisController.getGoalsAnalysis(req, res),
);

export default router;
