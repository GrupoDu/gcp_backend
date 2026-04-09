import { Router, type Request, type Response } from "express";
import StockOperationController from "../controllers/stockOperation.controller.js";
import StockOperationService from "../services/stockOperation.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = Router();
const stockOperationService = new StockOperationService(prisma);
const stockOperationController = new StockOperationController(
  stockOperationService,
);

router.post(
  "/process-stock-operation",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    stockOperationController.processStockOperation(req, res),
);

export default router;
