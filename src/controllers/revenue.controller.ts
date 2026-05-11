import type { Request, Response } from "express";
import RevenueService from "../services/revenue.service.js";
import type {
  IRevenueCreate,
  IRevenueUpdate,
} from "../types/revenue.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import { hasValidString } from "../utils/hasValidString.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import {
  RevenueSchema,
  RevenueUpdateSchema,
} from "../schemas/revenue.schema.js";
import { toRecord } from "../utils/toRecord.js";

/**
 * Controller responsável por gerenciar receitas
 *
 * @class RevenueController
 * @see RevenueService
 */
class RevenueController {
  private _revenueService: RevenueService;

  /** @param {RevenueService} revenueService - Instância do serviço de receita */
  constructor(revenueService: RevenueService) {
    this._revenueService = revenueService;
  }

  /**
   * Método responsável por retornar todos os registros de receita
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async getAllRevenues(req: Request, res: Response): Promise<Response> {
    try {
      const revenues = await this._revenueService.getAllRevenues();
      return res
        .status(200)
        .json(
          successResponseWith(revenues, "Receitas encontradas com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por retornar uma receita por ID
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async getRevenueById(req: Request, res: Response): Promise<Response> {
    const { revenue_uuid } = req.params;

    try {
      if (!hasValidString(revenue_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["revenue_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const revenue = await this._revenueService.getRevenueById(revenue_uuid);

      return res
        .status(200)
        .json(successResponseWith(revenue, "Receita encontrada com sucesso."));
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Receita não encontrada" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }

  /**
   * Método responsável por criar uma nova receita
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async createRevenue(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body as IRevenueCreate;
      const { schemaErr, isMissingFields, requiredFieldsMessage } =
        checkMissingFields(toRecord(data), RevenueSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const newRevenue = await this._revenueService.createRevenue(data);

      return res
        .status(201)
        .json(
          successResponseWith(newRevenue, "Receita criada com sucesso", 201),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por atualizar uma receita
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async updateRevenue(req: Request, res: Response): Promise<Response> {
    const { revenue_uuid } = req.params;
    const updateData = req.body as IRevenueUpdate;

    try {
      const { isMissingFields } = checkMissingFields(
        toRecord(updateData),
        RevenueUpdateSchema,
      );

      if (!hasValidString(revenue_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["revenue_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields) {
        return res
          .status(400)
          .json(
            errorResponseWith(
              "Nenhum campo para atualização foi fornecido",
              400,
            ),
          );
      }

      const updated = await this._revenueService.updateRevenue(
        revenue_uuid,
        updateData,
      );

      return res
        .status(200)
        .json(successResponseWith(updated, "Receita atualizada com sucesso."));
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Receita não encontrada" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }
}

export default RevenueController;
