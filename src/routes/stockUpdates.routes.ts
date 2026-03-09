import express from "express";
import type { Request, Response, Router } from "express";
import StockUpdatesController from "../controllers/stockUpdates.controller.js";
import StockUpdatesService from "../services/stockUpdates.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const stockUpdatesService = new StockUpdatesService(prisma);
const stockUpdatesController = new StockUpdatesController(stockUpdatesService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  stockUpdatesController.getStockUpdates(req, res),
);
router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  stockUpdatesController.getStockUpdates(req, res),
);

export default router;
