import type { Request, Response } from "express";
import OrderItemsService from "../services/orderItems.service.js";
import type { IOrderItemsCreate } from "../types/orderItems.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import { hasValidString } from "../utils/hasValidString.js";
import { OrderItemCreateSchema } from "../schemas/orderItem.schema.js";

/**
 * Controller responsável por gerenciar os itens de um pedido
 */
class OrderItemsController {
  private _orderItemsService: OrderItemsService;

  /** @param {OrderItemsService} orderItemsService - Instância do serviço de itens de pedido */
  constructor(orderItemsService: OrderItemsService) {
    this._orderItemsService = orderItemsService;
  }

  /**
   * Retorna os itens de um pedido
   */
  async getOrderItems(req: Request, res: Response): Promise<Response> {
    try {
      const { order_uuid } = req.params;

      if (!hasValidString(order_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["order_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const orderItems =
        await this._orderItemsService.getOrderItems(order_uuid);

      return res
        .status(200)
        .json(
          successResponseWith(
            orderItems,
            "Itens do pedido encontrados com sucesso",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Adiciona um item ao pedido
   */
  async addItemsToOrder(req: Request, res: Response): Promise<Response> {
    const orderItemsData = req.body as IOrderItemsCreate;
    const { order_uuid } = req.params;

    try {
      const { isMissingFields, requiredFieldsMessage, schemaErr } =
        checkMissingFields(orderItemsData, OrderItemCreateSchema);

      if (!hasValidString(order_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["order_uuid"]),
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

      const newOrderItem = await this._orderItemsService.addItemsToOrder(
        orderItemsData,
        order_uuid,
      );

      return res
        .status(201)
        .json(
          successResponseWith(
            newOrderItem,
            "Item adicionado ao pedido com sucesso",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Remove um item do pedido
   */
  async removeItemFromOrder(req: Request, res: Response): Promise<Response> {
    const { order_uuid } = req.params;
    const { product_uuid } = req.body as { product_uuid: string };

    try {
      if (!hasValidString(order_uuid) || !hasValidString(product_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["order_uuid", "product_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const result = await this._orderItemsService.removeItemFromOrder(
        order_uuid,
        product_uuid,
      );

      if (!result) {
        return res
          .status(404)
          .json(errorResponseWith("Item do pedido não encontrado", 404));
      }

      return res
        .status(200)
        .json(
          successResponseWith(result, "Item do pedido removido com sucesso"),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default OrderItemsController;
