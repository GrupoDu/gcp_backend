import express, { type Request, type Response } from "express";
import AnualAnalysisService from "../services/anualAnalysis.service.js";
import { prisma } from "../../lib/prisma.js";
import AnualAnalysisController from "../controllers/anualAnalysis.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();
const anualAnalysisService = new AnualAnalysisService(prisma);
const anualAnalysisController = new AnualAnalysisController(
  anualAnalysisService,
);

router.get("/", adminAuthMiddleware, (req: Request, res: Response) =>
  anualAnalysisController.getAllAnualAnalysisService(req, res),
);

export default router;
