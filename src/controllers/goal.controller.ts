import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type GoalService from "../services/goal.service.js";

class GoalController {
  private goalService: GoalService;
  
  constructor(goalService: GoalService) {
    this.goalService = goalService;
  }

  async getAllGoalsData(req: Request, res: Response): Promise<Response> {
    try {
      const allGoalsData = await this.goalService.getAllGoalsData();

      return res.status(200).json(allGoalsData);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async createNewGoal(req: Request, res: Response): Promise<Response> {
    try {
      const newGoalInfos = req.body;

      const newGoal = await this.goalService.createNewGoal(newGoalInfos);

      return res
        .status(201)
        .json({ message: "Meta criada com sucess.", goal: newGoal });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async removeGoalData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      await this.goalService.deleteGoal(uuid as string);

      return res.status(200).json({ message: "Meta removida com sucesso." });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async updateGoalData(req: Request, res: Response): Promise<Response> {
    try {
      const updateGoalValues = req.body;
      const { uuid } = req.params;

      const updatedGoal = await this.goalService.updateGoalData(
        updateGoalValues,
        uuid as string,
      );

      return res
        .status(200)
        .json({ message: "Dados de meta atualizado.", update: updatedGoal });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default GoalController;
