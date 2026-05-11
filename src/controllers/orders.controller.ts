import type { Request, Response } from "express";
import OrdersService from "../services/orders.service.js";
import type {
  IOrderCreateInput,
  IOrderUpdate,
} from "../types/orders.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import { hasValidString } from "../utils/hasValidString.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import { OrderSchema, OrderUpdateSchema } from "../schemas/order.schema.js";
import type { IProductionOrderCreate } from "../types/productionOrder.interface.js";
import { toRecord } from "../utils/toRecord.js";

/**
 * Controller responsável por gerenciar pedidos
 */
class OrdersController {
  private _ordersService: OrdersService;

  /** @param {OrdersService} ordersService - Instância do serviço de pedidos */
  constructor(ordersService: OrdersService) {
    this._ordersService = ordersService;
  }

  /**
   * Método responsável por retornar todos os pedidos
   */
  async getOrders(req: Request, res: Response): Promise<Response> {
    try {
      const orders = await this._ordersService.getOrders();
      return res
        .status(200)
        .json(successResponseWith(orders, "Pedidos encontrados com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por retornar um pedido por UUID
   */
  async getOrderById(req: Request, res: Response): Promise<Response> {
    const { order_uuid } = req.params;

    try {
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

      const order = await this._ordersService.getOrderById(order_uuid);

      return res
        .status(200)
        .json(successResponseWith(order, "Pedido encontrado com sucesso."));
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Pedido não encontrado" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }

  /**
   * Método responsável por criar um novo pedido
   */
  async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      const newOrderData = req.body as IOrderCreateInput;
      const { schemaErr, isMissingFields, requiredFieldsMessage } =
        checkMissingFields(toRecord(newOrderData), OrderSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const newOrder = await this._ordersService.createOrder(newOrderData);

      return res
        .status(201)
        .json(successResponseWith(newOrder, "Pedido criado com sucesso", 201));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por atualizar um pedido
   */
  async updateOrder(req: Request, res: Response): Promise<Response> {
    const { order_uuid } = req.params;
    const updateData = req.body as IOrderUpdate;

    try {
      const { isMissingFields } = checkMissingFields(
        updateData,
        OrderUpdateSchema,
      );

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
          .status(400)
          .json(
            errorResponseWith(
              "Nenhum campo para atualização foi fornecido",
              400,
            ),
          );
      }

      const updatedOrder = await this._ordersService.updateOrder(
        order_uuid,
        updateData,
      );

      return res
        .status(200)
        .json(
          successResponseWith(updatedOrder, "Pedido atualizado com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Pedido não encontrado" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }

  /**
   * Método responsável por atualizar o status de um pedido
   */
  async updateOrderStatus(req: Request, res: Response): Promise<Response> {
    const { order_uuid } = req.params;
    const { order_status, productionOrders } = req.body as {
      order_status: string;
      productionOrders: IProductionOrderCreate[];
    };

    try {
      if (!hasValidString(order_uuid) || !hasValidString(order_status)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["order_uuid", "status"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const result = await this._ordersService.updateOrderStatus(
        order_uuid,
        order_status,
        productionOrders,
      );

      return res
        .status(200)
        .json(
          successResponseWith(
            result,
            `Status do pedido atualizado para: ${order_status}`,
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default OrdersController;
