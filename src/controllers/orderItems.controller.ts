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
 *
 * @class OrderItemsController
 * @see OrderItemsService
 */
class OrderItemsController {
  private _orderItemsService: OrderItemsService;

  /** @param {OrderItemsService} orderItemsService - Instância do serviço de itens de pedido */
  constructor(orderItemsService: OrderItemsService) {
    this._orderItemsService = orderItemsService;
  }

  /**
   * Retorna os itens de um pedido
   *
   * @returns {Promise<Response>} - Objeto com itens do pédido
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see OrderItemsController
   */
  async getOrderItems(req: Request, res: Response): Promise<Response> {
    try {
      const { order_id } = req.params;

      if (!hasValidString(order_id)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["order_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const orderItems = await this._orderItemsService.getOrderItems(order_id);

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
   *
   * @returns {Promise<Response>} - Objeto com item adicionado ao pedido
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see OrderItemsController
   */
  async addItemsToOrder(req: Request, res: Response): Promise<Response> {
    const orderItemsData = req.body as IOrderItemsCreate;
    const { order_id } = req.params;

    try {
      const { isMissingFields, requiredFieldsMessage, schemaErr } =
        checkMissingFields(orderItemsData, OrderItemCreateSchema);

      if (!hasValidString(order_id)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["order_id"]),
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

      // Depois implementar essa verificação!!!
      // if (
      //   orderItemsData.unit_price.lessThan(0) ||
      //   orderItemsData.quantity.lessThan(0)
      // ) {
      //   return res.status(400).json({
      //     success: false,
      //     message:
      //       "unit_price deve ser maior ou igual a 0 e quantity deve ser maior que 0",
      //   });
      // }

      const newOrderItem = await this._orderItemsService.addItemsToOrder(
        orderItemsData,
        order_id,
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
   *
   * @returns {Promise<Response>} - Objeto com item removido do pedido
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see OrderItemsController
   */
  async removeItemFromOrder(req: Request, res: Response): Promise<Response> {
    const { order_id } = req.params;
    const { product_id } = req.body as { product_id: string };

    try {
      if (!hasValidString(order_id) || !hasValidString(product_id)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["order_id", "product_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const result = await this._orderItemsService.removeItemFromOrder(
        order_id,
        product_id,
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
