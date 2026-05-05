import { Router, type Request, type Response } from "express";
import RevenueController from "../controllers/revenue.controller.js";
import RevenueService from "../services/revenue.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = Router();
const revenueService = new RevenueService(prisma);
const revenueController = new RevenueController(revenueService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  revenueController.getAllRevenues(req, res),
);

router.get("/:revenue_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  revenueController.getRevenueById(req, res),
);

router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  revenueController.createRevenue(req, res),
);

router.put("/:revenue_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  revenueController.updateRevenue(req, res),
);

export default router;
