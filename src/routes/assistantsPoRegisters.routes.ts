import express, { type Request, type Response, type Router } from "express";
import AssistantsPoRegistersService from "../services/assistantsPoRegisters.service.js";
import { prisma } from "../../lib/prisma.js";
import AssistantsPORegistersController from "../controllers/assistantsPoRegisters.controller.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const assistantsPoRegistersService = new AssistantsPoRegistersService(prisma);
const assistantsPORegistersController = new AssistantsPORegistersController(
  assistantsPoRegistersService,
);
router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  assistantsPORegistersController.getAllAssistantsPORegisters(req, res),
);
router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  assistantsPORegistersController.createAssistantPORegister(req, res),
);
router.put("/deliver", getTokenMiddleware, (req: Request, res: Response) =>
  assistantsPORegistersController.updateAssistantPORegisterAsDelivered(
    req,
    res,
  ),
);

export default router;
