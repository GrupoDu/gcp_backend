import type { Request, Response } from "express";
import type ProductionOrderService from "../services/productionOrder.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import type {
  IProductionOrderCreate,
  IProductionOrderUpdate,
} from "../types/productionOrder.interface.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import { CreateProductionOrderSchema } from "../schemas/productionOrder.schema.js";
import { hasValidString } from "../utils/hasValidString.js";

/**
 * Controller responsável por gerenciar as ordens de produção.
 */
class ProductionOrderController {
  private _productionOrderService: ProductionOrderService;

  /** @param {ProductionOrderService} productionOrderService - Instância do serviço de ordem de produção */
  constructor(productionOrderService: ProductionOrderService) {
    this._productionOrderService = productionOrderService;
  }

  /**
   * Método responsável por buscar todas as ordens de produção
   */
  async getAllProductionOrders(req: Request, res: Response): Promise<Response> {
    try {
      const productionOrders =
        await this._productionOrderService.getAllProductionOrders();

      return res
        .status(200)
        .json(
          successResponseWith(
            productionOrders,
            "Dados encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por buscar uma ordem de produção pelo seu UUID
   */
  async getProductionOrderById(req: Request, res: Response): Promise<Response> {
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

      const targetProductionOrder =
        await this._productionOrderService.getProductionOrderById(
          production_order_uuid,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            targetProductionOrder,
            "Dado encontrado com sucesso.",
          ),
        );
    } catch (err) {
      const error: Error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responável por criar ordem de produção
   */
  async createProductionOrder(req: Request, res: Response): Promise<Response> {
    const newProductionOrderValues = req.body as IProductionOrderCreate;

    try {
      const newProductionOrderValuesRecord =
        newProductionOrderValues as unknown as Record<string, unknown>;

      const { isMissingFields, requiredFieldsMessage, schemaErr } =
        checkMissingFields(
          newProductionOrderValuesRecord,
          CreateProductionOrderSchema,
        );

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(requiredFieldsMessage, 422, schemaErr));
      }

      const newProductionOrder =
        await this._productionOrderService.createProductionOrder(
          newProductionOrderValues,
        );

      return res
        .status(201)
        .json(
          successResponseWith(
            newProductionOrder,
            "Ordem de produção criada com sucesso.",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;

      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responável por remover ordem de produção
   */
  async removeProductionOrder(req: Request, res: Response): Promise<Response> {
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

      const removeResponse =
        await this._productionOrderService.removeProductionOrder(
          production_order_uuid,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            removeResponse,
            "Ordem de produção deletada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por atualizar ordem de produção
   */
  async updateProductionOrder(req: Request, res: Response): Promise<Response> {
    const ProductionOrderNewValues = req.body as IProductionOrderUpdate;
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

      const updatedProductionOrder =
        await this._productionOrderService.updateProductionOrder(
          ProductionOrderNewValues,
          production_order_uuid,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            updatedProductionOrder,
            "Ordem de produção atualizada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por validar estoque de uma ordem de produção
   */
  async stockProductionValidation(
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

      await this._productionOrderService.stockProductionValidation(
        production_order_uuid,
      );

      return res
        .status(200)
        .json(
          successResponseWith(
            "Validação realizada.",
            "Validação de estoque realizada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;

      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default ProductionOrderController;
