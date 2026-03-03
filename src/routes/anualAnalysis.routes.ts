import express, { Router, type Request, type Response } from "express";
import AnualAnalysisService from "../services/anualAnalysis.service.ts";
import { prisma } from "../../lib/prisma.ts";
import AnualAnalysisController from "../controllers/anualAnalysis.controller.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.ts";

const router: Router = express.Router();
const anualAnalysisService = new AnualAnalysisService(prisma);
const anualAnalysisController = new AnualAnalysisController(
  anualAnalysisService,
);

router.get(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) =>
    anualAnalysisController.getAllAnualAnalysisService(req, res),
);
router.put(
  "/updateAnalysis",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    anualAnalysisController.updateDeliveredAnualAnalysis(req, res),
);

export default router;
