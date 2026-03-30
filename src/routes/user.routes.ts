import { Router, type Request, type Response } from "express";
import UserController from "../controllers/user.controller.js";
import UserService from "../services/user.service.js";
import { prisma } from "../../lib/prisma.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = Router();
const userService = new UserService(prisma);
const userController = new UserController(userService);

router.get(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => userController.getAllUsers(req, res),
);
router.post(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => userController.createNewUser(req, res),
);
router.get("/supervisors", getTokenMiddleware, (req: Request, res: Response) =>
  userController.getAllSupervisorsUser(req, res),
);
router.get("/validator", getTokenMiddleware, (req: Request, res: Response) =>
  userController.tokenValidator(req, res),
);
router.get(
  "/:user_uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => userController.getUserById(req, res),
);
router.delete(
  "/:user_uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => userController.deleteUser(req, res),
);
router.put(
  "/:user_uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => userController.updateUserData(req, res),
);

export default router;
