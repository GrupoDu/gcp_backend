import express, { type Request, type Response } from "express";
import GoalController from "../controllers/goal.controller.js";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  new GoalController().getAllGoalsData(req, res);
});
router.post("/", (req: Request, res: Response) => {
  new GoalController().createNewGoal(req, res);
});
router.delete("/:uuid", (req: Request, res: Response) => {
  new GoalController().removeGoalData(req, res);
});
router.put("/:uui", (req: Request, res: Response) => {
  new GoalController().updateGoalData(req, res);
});

export default router;
