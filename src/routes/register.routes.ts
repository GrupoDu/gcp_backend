import express from "express";
import RegisterController from "../controllers/register.controller.js";
import type { Request, Response } from "express";
import RegisterService from "../services/register.service.js";
import { prisma } from "../../lib/prisma.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();
const registerService = new RegisterService(prisma);
const registerController = new RegisterController(registerService);

router.get("/", (req: Request, res: Response) =>
  registerController.getAllProductionRegisters(req, res),
);
router.post("/", adminAuthMiddleware, (req: Request, res: Response) =>
  registerController.createNewRegister(req, res),
);
router.delete("/:uuid", adminAuthMiddleware, (req: Request, res: Response) =>
  registerController.removeRegisterData(req, res),
);
router.put("/:uuid", (req: Request, res: Response) =>
  registerController.updateRegister(req, res),
);

export default router;
