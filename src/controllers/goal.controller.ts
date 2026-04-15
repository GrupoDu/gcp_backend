import type { Request, Response } from "express";
import type GoalService from "../services/goal.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import type { IGoalCreate, IGoalUpdate } from "../types/goal.interface.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import { GoalCreateSchema, GoalUpdateSchema } from "../schemas/goal.schema.js";
import { hasValidString } from "../utils/hasValidString.js";

/**
 * Controller responsável por gerenciar as operações relacionadas a meta.
 *
 * @class GoalController
 * @see GoalService
 */
class GoalController {
  private _goalService: GoalService;

  /** @param {GoalService} goalService - Serviço de meta */
  constructor(goalService: GoalService) {
    this._goalService = goalService;
  }

  /**
   * Busca todos os dados de meta.
   *
   * @returns {Promise<Response>} - Objeto com mensagem de sucesso
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see GoalController
   */
  async getGoalsData(req: Request, res: Response): Promise<Response> {
    try {
      const goals = await this._goalService.getAllGoalsData();

      return res
        .status(200)
        .json(successResponseWith(goals, "Dados encontrados com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por criar uma nova meta.
   *
   * @returns {Promise<Response>} - Objeto com mensagem de sucesso
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see GoalController
   */
  async createNewGoal(req: Request, res: Response): Promise<Response> {
    const newGoalInfos = req.body as IGoalCreate;

    try {
      const { requiredFieldsMessage, isMissingFields, schemaErr } =
        checkMissingFields(newGoalInfos, GoalCreateSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const newGoal = await this._goalService.createNewGoal(newGoalInfos);

      return res
        .status(201)
        .json(successResponseWith(newGoal, "Meta criada com sucesso.", 201));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por remover uma meta.
   *
   * @returns {Promise<Response>} - Objeto com mensagem de sucesso
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see GoalController
   */
  async removeGoalData(req: Request, res: Response): Promise<Response> {
    try {
      const { goal_uuid } = req.params;

      if (!hasValidString(goal_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["goal_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this._goalService.deleteGoal(goal_uuid);

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

  /**
   * Método responsável por atualizar os dados de uma meta.
   *
   * @returns {Promise<Response>} - Objeto com mensagem de sucesso
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see GoalController
   */
  async updateGoalData(req: Request, res: Response): Promise<Response> {
    const updateGoalValues = req.body as IGoalUpdate;
    const { goal_uuid } = req.params;

    try {
      const { requiredFieldsMessage, schemaErr, isMissingFields } =
        checkMissingFields(updateGoalValues, GoalUpdateSchema);

      if (!hasValidString(goal_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["goal_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const updatedGoal = await this._goalService.updateGoalData(
        updateGoalValues,
        goal_uuid,
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
