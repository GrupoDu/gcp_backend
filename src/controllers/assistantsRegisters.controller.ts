import type AssistantsRegistersService from "../services/assistantsRegisters.service.js";
import type { Request, Response } from "express";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import type {
  IAssistantsRegisterIdentifiers,
  IAssistantsRegisterCreate,
} from "../types/assistantsRegisters.interface.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import AssistantsRegisterIdentifiers, {
  AssistantsRegisterCreateSchema,
} from "../schemas/assistantsRegisters.schema.js";
import { hasValidString } from "../utils/hasValidString.js";

/**
 * Controller responsável por registrar atividade dos assistentes
 *
 * @class AssistantsPORegistersController
 * @see AssistantsPoRegistersService
 */
export default class AssistantsRegistersController {
  private _assistantsRegistersService: AssistantsRegistersService;

  /** @param {AssistantsPoRegistersService} assistantsPoRegistersService - Serviço de registros de atividade dos assistentes */
  constructor(assistantsPoRegistersService: AssistantsRegistersService) {
    this._assistantsRegistersService = assistantsPoRegistersService;
  }

  /**
   * Método responsável por buscar todos os registros de atividade dos assistentes
   *
   * @returns {Promise<Response>} Objeto com todos os registros de atividade dos assistentes
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see AssistantsPoRegistersController
   */
  async getAllAssistantsPORegisters(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allAssistantsPORegisters =
        await this._assistantsRegistersService.getAllAssistantsRegisters();

      return res
        .status(200)
        .json(
          successResponseWith(
            allAssistantsPORegisters,
            "Dados encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por buscar todos os registros de atividade dos assistentes por ID de produção
   *
   * @returns {Promise<Response>} Objeto com todos os registros de atividade dos assistentes por ID de produção
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see AssistantsPoRegistersController
   */
  async getAssistantsRegistersByProductionOrderId(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { production_order_uuid } = req.params;

    try {
      if (!hasValidString(production_order_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["production_order_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const assistantsPORegistersByProductionOrderId =
        await this._assistantsRegistersService.getAssistantRegistersByAssistantId(
          production_order_uuid,
        );
      return res
        .status(200)
        .json(
          successResponseWith(
            assistantsPORegistersByProductionOrderId,
            "Registros encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por criar um novo registro de atividade do assistente
   *
   * @returns {Promise<Response>} Objeto com o novo registro de atividade do assistente
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see AssistantsPoRegistersController
   */
  async createAssistantPORegister(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const newAssistantRegisterValues = req.body as IAssistantsRegisterCreate;
    const { isMissingFields, requiredFieldsMessage, schemaErr } =
      checkMissingFields(
        newAssistantRegisterValues,
        AssistantsRegisterCreateSchema,
      );

    try {
      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const newAssistantPORegister =
        await this._assistantsRegistersService.createAssistantRegister(
          newAssistantRegisterValues,
        );

      return res
        .status(201)
        .json(
          successResponseWith(
            newAssistantPORegister,
            "Registro de assistente criado com sucesso.",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por atualizar um registro de atividade do assistente como entregue
   *
   * @returns {Promise<Response>} Objeto com o registro de atividade do assistente atualizado
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see AssistantsPoRegistersController
   */
  async updateAssistantPORegisterAsDelivered(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const identifierValues = req.body as IAssistantsRegisterIdentifiers;
    const { isMissingFields, requiredFieldsMessage, schemaErr } =
      checkMissingFields(identifierValues, AssistantsRegisterIdentifiers);

    try {
      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const assistantPORegisterUpdateResponse =
        await this._assistantsRegistersService.updateAssistantRegisterAsDelivered(
          identifierValues,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            assistantPORegisterUpdateResponse,
            "Registro atualizado como entregue com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}
