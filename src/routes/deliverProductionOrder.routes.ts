import express from "express";
import DeliverProductionOrderController from "../controllers/deliverProductionOrder.controller.js";
import type { Request, Response, Router } from "express";
import DeliverProductionOrderService from "../services/deliverProductionOrder.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const deliverProductionOrderService = new DeliverProductionOrderService(prisma);
const deliverProductionOrderController = new DeliverProductionOrderController(
  deliverProductionOrderService,
);

router.put(
  "/:production_order_id",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    deliverProductionOrderController.deliverProductionOrder(req, res),
);

export default router;