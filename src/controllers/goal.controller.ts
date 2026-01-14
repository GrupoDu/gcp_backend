import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type { IGoal } from "../types/models.interface.js";
import { prisma } from "../../lib/prisma.js";

class GoalController {
  async getAllGoalsData(req: Request, res: Response): Promise<Response> {
    try {
      const allGoalsData: IGoal[] = await prisma.goal.findMany();

      return res.status(200).json(allGoalsData);
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async createNewGoal(req: Request, res: Response): Promise<Response> {
    try {
      const { newGoalInfos } = req.body;

      const newGoal: IGoal = await prisma.goal.create({
        data: newGoalInfos,
      });

      return res
        .status(201)
        .json({ message: "Meta criada com sucess.", goal: newGoal });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async removeGoalData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      const goalToBeRemoved = {
        where: {
          goal_id: uuid as string,
        },
      };

      await prisma.goal.delete(goalToBeRemoved);

      return res.status(200).json({ message: "Meta removida com sucesso." });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async updateGoalData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;
      const updateGoalValues = req.body;

      const goalToBeUpdated = {
        where: {
          goal_id: uuid as string,
        },
        data: updateGoalValues,
      };

      const updatedGoal = await prisma.goal.update(goalToBeUpdated);

      return res
        .status(200)
        .json({ message: "Dados de meta atualizado.", update: updatedGoal });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }
}
