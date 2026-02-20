import express, { Router, type Request, type Response } from "express";
import UserController from "../controllers/user.controller.ts";
import UserService from "../services/user.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";

const router: Router = express.Router();
const userService = new UserService(prisma);
const userController = new UserController(userService);

router.get("/", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.getAllUsers(req, res),
);
router.post("/", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.createNewUser(req, res),
);
router.get("/supervisors", (req: Request, res: Response) =>
  userController.getAllSupervisorsUser(req, res),
);
router.get("/validator", (req: Request, res: Response) =>
  userController.tokenValidator(req, res),
);
router.get("/:uuid", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.getUserById(req, res),
);
router.delete("/:uuid", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.deleteUser(req, res),
);
router.put("/:uuid", adminAuthMiddleware, (req: Request, res: Response) =>
  userController.updateUserData(req, res),
);

export default router;
