import { Router, type Request, type Response } from "express";
import OrderItemsController from "../controllers/orderItems.controller.js";
import OrderItemsService from "../services/orderItems.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = Router();
const orderItemsService = new OrderItemsService(prisma);
const orderItemsController = new OrderItemsController(orderItemsService);

router.get("/:order_id", getTokenMiddleware, (req: Request, res: Response) =>
  orderItemsController.getOrderItems(req, res),
);

router.post("/:order_id", getTokenMiddleware, (req: Request, res: Response) =>
  orderItemsController.addItemsToOrder(req, res),
);

router.delete("/:order_id", getTokenMiddleware, (req: Request, res: Response) =>
  orderItemsController.removeItemFromOrder(req, res),
);

export default router;
