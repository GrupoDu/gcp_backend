import express from "express";
import ProductionOrderController from "../controllers/productionOrder.controller.js";
import type { Request, Response, Router } from "express";
import ProductionOrderService from "../services/productionOrder.service.js";
import { prisma } from "../../lib/prisma.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const productionOrderService = new ProductionOrderService(prisma);
const productionOrderController = new ProductionOrderController(
  productionOrderService,
);

router.get("/", (req: Request, res: Response) =>
  productionOrderController.getAllProductionRegisters(req, res),
);
router.post("/", (req: Request, res: Response) =>
  productionOrderController.createNewProductionOrder(req, res),
);
router.get("/:uuid", (req: Request, res: Response) =>
  productionOrderController.getProductionOrderById(req, res),
);
router.delete(
  "/:uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) =>
    productionOrderController.removeTask(req, res),
);
router.put("/:uuid", (req: Request, res: Response) =>
  productionOrderController.updateProductionOrder(req, res),
);
router.put("/deliver/:production_order_id", (req: Request, res: Response) =>
  productionOrderController.deliverProductionOrder(req, res),
);

export default router;
