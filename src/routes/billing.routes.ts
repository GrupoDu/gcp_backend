import { Router, type Request, type Response } from "express";
import BillingController from "../controllers/billing.controller.js";
import BillingService from "../services/billing.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = Router();
const billingService = new BillingService(prisma);
const billingController = new BillingController(billingService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  billingController.getAllBillings(req, res),
);

router.get("/:billing_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  billingController.getBillingById(req, res),
);

router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  billingController.createBilling(req, res),
);

router.put("/:billing_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  billingController.updateBilling(req, res),
);

export default router;
