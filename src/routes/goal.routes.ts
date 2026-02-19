import express, { Router, type Request, type Response } from "express";
import GoalController from "../controllers/goal.controller.ts";
import GoalService from "../services/goal.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";

const router: Router = express.Router();
const goalService = new GoalService(prisma);
const goalController = new GoalController(goalService);

router.get("/", (req: Request, res: Response) => {
  goalController.getAllGoalsData(req, res);
});
router.post("/", adminAuthMiddleware, (req: Request, res: Response) => {
  goalController.createNewGoal(req, res);
});
router.delete("/:uuid", adminAuthMiddleware, (req: Request, res: Response) => {
  goalController.removeGoalData(req, res);
});
router.put("/:uuid", adminAuthMiddleware, (req: Request, res: Response) => {
  goalController.updateGoalData(req, res);
});

export default router;
