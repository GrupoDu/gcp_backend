import type { Request, Response } from "express";
import type GoalService from "../services/goal.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

class GoalController {
  private goalService: GoalService;

  constructor(goalService: GoalService) {
    this.goalService = goalService;
  }

  async getAllGoalsData(req: Request, res: Response): Promise<Response> {
    try {
      const allGoalsData = await this.goalService.getAllGoalsData();

      return res
        .status(200)
        .json(
          successResponseWith(allGoalsData, "Dados encontrados com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async createNewGoal(req: Request, res: Response): Promise<Response> {
    try {
      const newGoalInfos = req.body;
      const fields = Object.keys(newGoalInfos);

      if (isMissingFields(newGoalInfos)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const newGoal = await this.goalService.createNewGoal(newGoalInfos);

      return res
        .status(201)
        .json(successResponseWith(newGoal, "Meta criada com sucesso.", 201));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async removeGoalData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this.goalService.deleteGoal(uuid as string);

      return res
        .status(200)
        .json(
          successResponseWith(
            "Remoção concluída",
            "Meta removida com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateGoalData(req: Request, res: Response): Promise<Response> {
    try {
      const updateGoalValues = req.body;
      const { uuid } = req.params;
      const fields = Object.keys(updateGoalValues);

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields(updateGoalValues)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const updatedGoal = await this.goalService.updateGoalData(
        updateGoalValues,
        uuid as string,
      );

      return res
        .status(200)
        .json(successResponseWith(updatedGoal, "Dados de meta atualizados."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default GoalController;
