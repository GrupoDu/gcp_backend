import type { Request, Response } from "express";
import OrdersService from "../services/orders.service.js";
import type { IOrderCreate, IOrderUpdate } from "../types/orders.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

export default class OrdersController {
  private _ordersService: OrdersService;

  constructor(ordersService: OrdersService) {
    this._ordersService = ordersService;
  }

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

  async getOrderById(req: Request, res: Response): Promise<Response> {
    try {
      const { order_id } = req.params;

      if (!order_id || typeof order_id !== "string") {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["order_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const order = await this._ordersService.getOrderById(order_id);

      if (!order) {
        return res
          .status(404)
          .json(errorResponseWith("Pedido não encontrado", 404));
      }

      return res
        .status(200)
        .json(successResponseWith(order, "Pedido encontrado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      const orderData: IOrderCreate = req.body;
      const fields = Object.keys(orderData);

      if (isMissingFields(orderData)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const newOrder = await this._ordersService.createOrder(orderData);

      return res
        .status(201)
        .json(successResponseWith(newOrder, "Pedido criado com sucesso", 201));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { order_id } = req.params;
      const updateData: IOrderUpdate = req.body;
      const fields = Object.keys(updateData);

      if (!order_id) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["order_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields(updateData)) {
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
        order_id as string,
        updateData,
      );

      if (!updatedOrder) {
        return res
          .status(404)
          .json(errorResponseWith("Pedido não encontrado", 404));
      }

      return res
        .status(200)
        .json(
          successResponseWith(updatedOrder, "Pedido atualizado com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { order_id } = req.params;
      const { status } = req.body;
      const statusData = { status };

      if (!order_id) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["order_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields(statusData)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["status"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const result = await this._ordersService.updateOrderStatus(
        order_id as string,
        status,
      );

      return res
        .status(200)
        .json(
          successResponseWith(
            result,
            `Status do pedido atualizado para: ${status}`,
          ),
        );
    } catch (err) {
      const error = err as Error;

      const { isOrderOnFinalStatus, isCurrentStatusInvalid, isOrderNotFound } =
        this.errorsCase(error);

      if (isOrderNotFound) {
        return res
          .status(404)
          .json(errorResponseWith("Pedido não encontrado", 404));
      }

      if (isCurrentStatusInvalid) {
        return res
          .status(400)
          .json(errorResponseWith("Status atual inválido", 400));
      }

      if (isOrderOnFinalStatus) {
        return res
          .status(400)
          .json(errorResponseWith("Pedido já está no status final", 400));
      }

      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  private errorsCase(error: Error) {
    const isOrderOnFinalStatus =
      error.message === "Order is already in final status";
    const isCurrentStatusInvalid = error.message === "Invalid current status";
    const isOrderNotFound = error.message === "Order not found";

    return { isOrderNotFound, isCurrentStatusInvalid, isOrderOnFinalStatus };
  }
}
