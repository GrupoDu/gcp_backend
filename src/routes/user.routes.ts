import express, { type Request, type Response } from "express";
import UserController from "../controllers/user.controller.js";
import UserService from "../services/user.service.js";
import { prisma } from "../../lib/prisma.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();
const userService = new UserService(prisma);
const userController = new UserController(userService);

router.get("/", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.getAllUsers(req, res),
);
router.post("/", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.createNewUser(req, res),
);
router.delete("/:uuid", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.deleteUser(req, res),
);
router.put("/:uuid", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.updateUserData(req, res),
);

export default router;
