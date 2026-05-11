import type { Request, Response } from "express";
import BillingService from "../services/billing.service.js";
import type {
  IBillingCreate,
  IBillingUpdate,
} from "../types/billing.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import { hasValidString } from "../utils/hasValidString.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import {
  BillingSchema,
  BillingUpdateSchema,
} from "../schemas/billing.schema.js";
import { toRecord } from "../utils/toRecord.js";

/**
 * Controller responsável por gerenciar faturamentos
 *
 * @class BillingController
 * @see BillingService
 */
class BillingController {
  private _billingService: BillingService;

  /** @param {BillingService} billingService - Instância do serviço de faturamento */
  constructor(billingService: BillingService) {
    this._billingService = billingService;
  }

  /**
   * Método responsável por retornar todos os faturamentos
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async getAllBillings(req: Request, res: Response): Promise<Response> {
    try {
      const billings = await this._billingService.getAllBillings();
      return res
        .status(200)
        .json(
          successResponseWith(
            billings,
            "Faturamentos encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por retornar um faturamento por ID
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async getBillingById(req: Request, res: Response): Promise<Response> {
    const { billing_uuid } = req.params;

    try {
      if (!hasValidString(billing_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["billing_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const billing = await this._billingService.getBillingById(billing_uuid);

      return res
        .status(200)
        .json(
          successResponseWith(billing, "Faturamento encontrado com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Faturamento não encontrado" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }

  /**
   * Método responsável por criar um novo faturamento
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async createBilling(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body as IBillingCreate;
      const { schemaErr, isMissingFields, requiredFieldsMessage } =
        checkMissingFields(toRecord(data), BillingSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const newBilling = await this._billingService.createBilling(data);

      return res
        .status(201)
        .json(
          successResponseWith(
            newBilling,
            "Faturamento criado com sucesso",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por atualizar um faturamento
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async updateBilling(req: Request, res: Response): Promise<Response> {
    const { billing_uuid } = req.params;
    const updateData = req.body as IBillingUpdate;

    try {
      const { isMissingFields } = checkMissingFields(
        toRecord(updateData),
        BillingUpdateSchema,
      );

      if (!hasValidString(billing_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["billing_uuid"]),
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

      const updated = await this._billingService.updateBilling(
        billing_uuid,
        updateData,
      );

      return res
        .status(200)
        .json(
          successResponseWith(updated, "Faturamento atualizado com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Faturamento não encontrado" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }
}

export default BillingController;
