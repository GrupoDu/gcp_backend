import express, { Router } from "express";
import { type Request, type Response } from "express";
import RegisterAnalysisService from "../services/productionOrderAnalysis.service.ts";
import { prisma } from "../../lib/prisma.ts";
import RegisterAnalysisController from "../controllers/productionOrderAnalysis.controller.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";

const router: Router = express.Router();
const registerAnalysisService = new RegisterAnalysisService(prisma);
const registerAnalysisController = new RegisterAnalysisController(
  registerAnalysisService,
);

router.get("/", adminAuthMiddleware, (req: Request, res: Response) =>
  registerAnalysisController.getProductionOrderAnalysis(req, res),
);

export default router;
