import express, { Router, type Request, type Response } from "express";
import AnnualAnalysisService from "../services/annualAnalysis.service.js";
import { prisma } from "../../lib/prisma.js";
import AnnualAnalysisController from "../controllers/annualAnalysis.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const annualAnalysisService = new AnnualAnalysisService(prisma);
const annualAnalysisController = new AnnualAnalysisController(
  annualAnalysisService,
);

router.get(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) =>
    annualAnalysisController.getAllAnualAnalysisService(req, res),
);
router.patch(
  "/update-analysis",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    annualAnalysisController.updateDeliveredAnualAnalysis(req, res),
);

export default router;
