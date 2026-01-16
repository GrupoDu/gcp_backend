import express from "express";
import LoginController from "../controllers/login.controller.js";
import type { Request, Response } from "express";
import validateUser from "../middlewares/validateUserLogin.middleware.js";

const router = express.Router();

router.post("/", validateUser, (req: Request, res: Response) =>
  new LoginController().userLogin(req, res)
);

export default router;
