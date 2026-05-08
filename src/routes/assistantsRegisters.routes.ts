import express, { type Request, type Response, type Router } from "express";
import AssistantsRegistersService from "../services/assistantsRegisters.service.js";
import { prisma } from "../../lib/prisma.js";
import AssistantsRegistersController from "../controllers/assistantsRegisters.controller.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const assistantsRegistersService = new AssistantsRegistersService(prisma);
const assistantsRegistersController = new AssistantsRegistersController(
  assistantsRegistersService,
);
router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  assistantsRegistersController.getAllAssistantsRegisters(req, res),
);
router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  assistantsRegistersController.createAssistantRegister(req, res),
);
router.patch("/deliver", getTokenMiddleware, (req: Request, res: Response) =>
  assistantsRegistersController.updateAssistantRegisterAsDelivered(req, res),
);
router.get(
  "/:production_order_uuid",
  getTokenMiddleware,
  (req: Request, res: Response) =>
    assistantsRegistersController.getAssistantsRegistersByProductionOrderId(
      req,
      res,
    ),
);

export default router;
