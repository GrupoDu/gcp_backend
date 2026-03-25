import express from "express";
import type { Request, Response, Router } from "express";
import ProductionOrderController from "../controllers/productionOrder.controller.js";
import ProductionOrderService from "../services/productionOrder.service.js";
import { prisma } from "../../lib/prisma.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const productionOrderService = new ProductionOrderService(prisma);
const productionOrderController = new ProductionOrderController(
  productionOrderService,
);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  productionOrderController.getAllProductionOrders(req, res),
);
router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  productionOrderController.createProductionOrder(req, res),
);
router.get(
  "/:production_order_id",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    productionOrderController.getProductionOrderById(req, res),
);
router.delete(
  "/:production_order_id",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) =>
    productionOrderController.removeProductionOrder(req, res),
);
router.put(
  "/:production_order_id",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    productionOrderController.updateProductionOrder(req, res),
);
router.put(
  "/deliver/:production_order_id",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    productionOrderController.deliverProductionOrder(req, res),
);
router.patch(
  "/validate/:production_order_id",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    productionOrderController.stockProductionValidation(req, res),
);

export default router;
