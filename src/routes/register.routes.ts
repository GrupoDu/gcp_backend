import express from "express";
import RegisterController from "../controllers/register.controller.js";
import type { Request, Response } from "express";

const router = express.Router();
router.get("/", (req: Request, res: Response) =>
  new RegisterController().getAllProductionRegisters(req, res)
);
router.post("/", (req: Request, res: Response) =>
  new RegisterController().createNewRegister(req, res)
);
router.delete("/:uuid", (req: Request, res: Response) =>
  new RegisterController().removeRegisterData(req, res)
);
router.put("/:uuid", (req: Request, res: Response) =>
  new RegisterController().updateRegister(req, res)
);

export default router;
