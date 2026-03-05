import express, { Router, type Request, type Response } from "express";
import GoalController from "../controllers/goal.controller.js";
import GoalService from "../services/goal.service.js";
import { prisma } from "../../lib/prisma.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const goalService = new GoalService(prisma);
const goalController = new GoalController(goalService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) => {
  goalController.getAllGoalsData(req, res);
});
router.post(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => {
    goalController.createNewGoal(req, res);
  },
);
router.delete(
  "/:uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => {
    goalController.removeGoalData(req, res);
  },
);
router.put(
  "/:uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => {
    goalController.updateGoalData(req, res);
  },
);

export default router;
