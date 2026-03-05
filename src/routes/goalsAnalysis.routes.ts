import express from "express";
import type { Request, Response, Router } from "express";
import GoalsAnalysisController from "../controllers/goalsAnalysis.controller.js";
import GoalsAnalysisService from "../services/goalsAnalysis.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

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
