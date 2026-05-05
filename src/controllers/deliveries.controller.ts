import type { Request, Response } from "express";
import DeliveriesService from "../services/deliveries.service.js";
import type {
  IDeliveryCreate,
  IDeliveryUpdate,
} from "../types/delivery.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import { hasValidString } from "../utils/hasValidString.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import {
  DeliveriesSchema,
  DeliveriesUpdateSchema,
} from "../schemas/deliveries.schema.js";
import { toRecord } from "../utils/toRecord.js";

/**
 * Controller responsável por gerenciar entregas
 *
 * @class DeliveriesController
 * @see DeliveriesService
 */
class DeliveriesController {
  private _deliveriesService: DeliveriesService;

  /** @param {DeliveriesService} deliveriesService - Instância do serviço de entrega */
  constructor(deliveriesService: DeliveriesService) {
    this._deliveriesService = deliveriesService;
  }

  /**
   * Método responsável por retornar todas as entregas
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async getAllDeliveries(req: Request, res: Response): Promise<Response> {
    try {
      const deliveries = await this._deliveriesService.getAllDeliveries();
      return res
        .status(200)
        .json(
          successResponseWith(deliveries, "Entregas encontradas com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por retornar uma entrega por ID
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async getDeliveryById(req: Request, res: Response): Promise<Response> {
    const { delivery_uuid } = req.params;

    try {
      if (!hasValidString(delivery_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["delivery_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const delivery =
        await this._deliveriesService.getDeliveryById(delivery_uuid);

      return res
        .status(200)
        .json(successResponseWith(delivery, "Entrega encontrada com sucesso."));
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Entrega não encontrada" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }

  /**
   * Método responsável por criar uma nova entrega
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async createDelivery(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body as IDeliveryCreate;
      const { schemaErr, isMissingFields, requiredFieldsMessage } =
        checkMissingFields(toRecord(data), DeliveriesSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const newDelivery = await this._deliveriesService.createDelivery(data);

      return res
        .status(201)
        .json(
          successResponseWith(newDelivery, "Entrega criada com sucesso", 201),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por atualizar uma entrega
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   */
  async updateDelivery(req: Request, res: Response): Promise<Response> {
    const { delivery_uuid } = req.params;
    const updateData = req.body as IDeliveryUpdate;

    try {
      const { isMissingFields } = checkMissingFields(
        toRecord(updateData),
        DeliveriesUpdateSchema,
      );

      if (!hasValidString(delivery_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["delivery_uuid"]),
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

      const updated = await this._deliveriesService.updateDelivery(
        delivery_uuid,
        updateData,
      );

      return res
        .status(200)
        .json(successResponseWith(updated, "Entrega atualizada com sucesso."));
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Entrega não encontrada" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }
}

export default DeliveriesController;
