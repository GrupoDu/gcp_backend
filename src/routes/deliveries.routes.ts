import { Router, type Request, type Response } from "express";
import DeliveriesController from "../controllers/deliveries.controller.js";
import DeliveriesService from "../services/deliveries.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = Router();
const deliveriesService = new DeliveriesService(prisma);
const deliveriesController = new DeliveriesController(deliveriesService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  deliveriesController.getAllDeliveries(req, res),
);

router.get("/:delivery_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  deliveriesController.getDeliveryById(req, res),
);

router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  deliveriesController.createDelivery(req, res),
);

router.put("/:delivery_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  deliveriesController.updateDelivery(req, res),
);

export default router;
