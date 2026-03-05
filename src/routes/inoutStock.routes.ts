import express from "express";
import type { Request, Response, Router } from "express";
import InOutStockController from "../controllers/inoutStock.controller.ts";
import InOutStockService from "../services/inoutStock.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.ts";

const router: Router = express.Router();
const inoutStockService = new InOutStockService(prisma);
const inoutStockController = new InOutStockController(inoutStockService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  inoutStockController.getInOutStockAnalysis(req, res),
);
router.post(
  "/incrementInStock",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    inoutStockController.incrementMonthlyInStockQuantity(req, res),
);
router.post(
  "/incrementOutStock",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    inoutStockController.incrementMonthlyOutStockQuantity(req, res),
);

export default router;
