import express, { Router, type Request, type Response } from "express";
import AnualAnalysisService from "../services/anualAnalysis.service.js";
import { prisma } from "../../lib/prisma.js";
import AnualAnalysisController from "../controllers/anualAnalysis.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

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
