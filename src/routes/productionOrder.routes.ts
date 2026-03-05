import express from "express";
import ProductionOrderController from "../controllers/productionOrder.controller.ts";
import type { Request, Response, Router } from "express";
import ProductionOrderService from "../services/productionOrder.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.ts";

const router: Router = express.Router();
const productionOrderService = new ProductionOrderService(prisma);
const productionOrderController = new ProductionOrderController(
  productionOrderService,
);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  productionOrderController.getAllProductionRegisters(req, res),
);
router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  productionOrderController.createNewProductionOrder(req, res),
);
router.get("/:uuid", getTokenMiddleware, (req: Request, res: Response) =>
  productionOrderController.getProductionOrderById(req, res),
);
router.delete(
  "/:uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) =>
    productionOrderController.removeTask(req, res),
);
router.put("/:uuid", getTokenMiddleware, (req: Request, res: Response) =>
  productionOrderController.updateProductionOrder(req, res),
);
router.put(
  "/deliver/:production_order_id",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    productionOrderController.deliverProductionOrder(req, res),
);

export default router;
