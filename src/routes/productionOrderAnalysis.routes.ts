import express from "express";
import { type Request, type Response } from "express";
import RegisterAnalysisService from "../services/productionOrderAnalysis.service.js";
import { prisma } from "../../lib/prisma.js";
import RegisterAnalysisController from "../controllers/productionOrderAnalysis.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();
const registerAnalysisService = new RegisterAnalysisService(prisma);
const registerAnalysisController = new RegisterAnalysisController(
  registerAnalysisService,
);

router.get("/", adminAuthMiddleware, (req: Request, res: Response) =>
  registerAnalysisController.getProductionOrderAnalysis(req, res),
);

export default router;
