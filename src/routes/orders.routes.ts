import express, { type Request, type Response, type Router } from "express";
import OrdersController from "../controllers/orders.controller.js";
import OrdersService from "../services/orders.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const ordersService = new OrdersService(prisma);
const ordersController = new OrdersController(ordersService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  ordersController.getOrders(req, res),
);

router.get("/:order_id", getTokenMiddleware, (req: Request, res: Response) =>
  ordersController.getOrderById(req, res),
);

router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  ordersController.createOrder(req, res),
);

router.put("/:order_id", getTokenMiddleware, (req: Request, res: Response) =>
  ordersController.updateOrder(req, res),
);

router.patch(
  "/:order_id/status",
  getTokenMiddleware,
  (req: Request, res: Response) => ordersController.updateOrderStatus(req, res),
);

export default router;
