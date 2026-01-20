import express, { type Request, type Response } from "express";
import GoalController from "../controllers/goal.controller.js";
import GoalService from "../services/goal.service.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();
const goalService = new GoalService(prisma);
const goalController = new GoalController(goalService);

router.get("/", (req: Request, res: Response) => {
  goalController.getAllGoalsData(req, res);
});
router.post("/", (req: Request, res: Response) => {
  goalController.createNewGoal(req, res);
});
router.delete("/:uuid", (req: Request, res: Response) => {
  goalController.removeGoalData(req, res);
});
router.put("/:uuid", (req: Request, res: Response) => {
  goalController.updateGoalData(req, res);
});

export default router;
