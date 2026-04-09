import type { Request, Response } from "express";
import type StockOperationService from "../services/stockOperation.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import { hasValidString } from "../utils/hasValidString.js";
import type { IStockOperationCreate } from "../types/stockOperation.interface.js";
import { isNumber } from "class-validator";
import checkMissingFields from "../utils/checkMissingFields.js";
import { StockOperationSchema } from "../schemas/stockOperation.schema.js";
import { toRecord } from "../utils/toRecord.js";

/**
 * Controller responsável por gerenciar operações combinadas de estoque.
 *
 * @class StockOperationController
 * @see StockOperationService
 */
class StockOperationController {
  private _stockOperationService: StockOperationService;

  /** @param {StockOperationService} stockOperationService - Instância do serviço de operações de estoque */
  constructor(stockOperationService: StockOperationService) {
    this._stockOperationService = stockOperationService;
  }

  /**
   * Método responsável por processar operação combinada de estoque
   *
   * @returns {Promise<Response>} - Objeto com resultado da operação combinada
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see StockOperationController
   */
  async processStockOperation(req: Request, res: Response): Promise<Response> {
    const stockOperationData = req.body as IStockOperationCreate;

    try {
      const isEntriesValid = this.validateEntries(stockOperationData);
      const { requiredFieldsMessage, schemaErr } = checkMissingFields(
        toRecord(stockOperationData),
        StockOperationSchema,
      );

      if (!isEntriesValid) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const result =
        await this._stockOperationService.processStockOperation(
          stockOperationData,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            result,
            "Operação combinada de estoque realizada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Valida os dados de entrada
   *
   * @param {IStockOperationCreate} entries - Valores vindo do body
   * @returns {boolean} - Retorna se os valores são validos
   * @private
   */
  private validateEntries(entries: IStockOperationCreate): boolean {
    const {
      production_order_id,
      product_quantity_title,
      event,
      product_id,
      validation,
      inStockIncrementQuantity,
      producedQuantity,
    } = entries;

    const hasValidStringValues =
      hasValidString(production_order_id) &&
      hasValidString(product_quantity_title) &&
      hasValidString(event) &&
      hasValidString(product_id);

    const hasValidNumberValues =
      isNumber(inStockIncrementQuantity) && isNumber(producedQuantity);

    const isValidationValid = validation !== undefined && validation !== null;

    return hasValidNumberValues && hasValidStringValues && isValidationValid;
  }
}

export default StockOperationController;
