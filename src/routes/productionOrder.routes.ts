import express from "express";
import ProductionOrderController from "../controllers/productionOrder.controller.ts";
import type { Request, Response, Router } from "express";
import ProductionOrderService from "../services/productionOrder.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";

const router: Router = express.Router();
const productionOrderService = new ProductionOrderService(prisma);
const productionOrderController = new ProductionOrderController(
  productionOrderService,
);

router.get("/", (req: Request, res: Response) =>
  productionOrderController.getAllProductionRegisters(req, res),
);
router.post("/", adminAuthMiddleware, (req: Request, res: Response) =>
  productionOrderController.createNewProductionOrder(req, res),
);
router.get("/:uuid", (req: Request, res: Response) =>
  productionOrderController.getProductionOrderById(req, res),
);
router.delete("/:uuid", adminAuthMiddleware, (req: Request, res: Response) =>
  productionOrderController.removeTask(req, res),
);
router.put("/:uuid", (req: Request, res: Response) =>
  productionOrderController.updateProductionOrder(req, res),
);

export default router;
