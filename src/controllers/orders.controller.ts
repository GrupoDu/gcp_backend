import type { Request, Response } from "express";
import OrdersService from "../services/orders.service.js";
import type { IOrderCreate, IOrderUpdate } from "../types/orders.interface.js";

export default class OrdersController {
  private ordersService: OrdersService;

  constructor(ordersService: OrdersService) {
    this.ordersService = ordersService;
  }

  async getOrders(req: Request, res: Response): Promise<Response> {
    try {
      const orders = await this.ordersService.getOrders();
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<Response> {
    try {
      const { order_id } = req.params;

      if (!order_id || typeof order_id !== "string") {
        return res.status(400).json({
          success: false,
          message: "ID do pedido é obrigatório e deve ser uma string válida",
        });
      }

      const order = await this.ordersService.getOrderById(order_id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado",
        });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Erro ao buscar pedido por ID:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      const orderData: IOrderCreate = req.body;

      const isAllFieldsFilled =
        !!orderData.order_status ||
        !!orderData.order_description ||
        !!orderData.product_quantity ||
        !!orderData.product_type ||
        !!orderData.product_uuid ||
        !!orderData.delivery_observation;

      if (!isAllFieldsFilled) {
        return res.status(400).json({
          success: false,
          message: "Todos os campos são obrigatórios",
        });
      }

      const newOrder = await this.ordersService.createOrder(orderData);

      return res.status(201).json({
        success: true,
        data: newOrder,
        message: "Pedido criado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { order_id } = req.params;
      const updateData: IOrderUpdate = req.body;

      const thereAreUpdateFields = Object.keys(updateData).length > 0;

      if (!thereAreUpdateFields)
        return res.status(400).json({
          success: false,
          message: "Nenhum campo para atualização foi fornecido",
        });

      const updatedOrder = await this.ordersService.updateOrder(
        order_id as string,
        updateData,
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado",
        });
      }

      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { order_id } = req.params;

      if (!order_id || typeof order_id !== "string") {
        return res.status(400).json({
          success: false,
          message: "ID do pedido é obrigatório e deve ser uma string válida",
        });
      }

      const result = await this.ordersService.updateOrderStatus(order_id);

      return res.status(200).json({
        success: true,
        data: result.order,
        nextStatus: result.nextStatus,
        message: `Status do pedido atualizado para: ${result.nextStatus}`,
      });
    } catch (err) {
      const error = err as Error;

      const { isOrderOnFinalStatus, isCurrentStatusInvalid, isOrderNotFound } =
        this.errorsCase(error);

      if (isOrderNotFound) {
        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado",
        });
      }

      if (isCurrentStatusInvalid) {
        return res.status(400).json({
          success: false,
          message: "Status atual inválido",
        });
      }

      if (isOrderOnFinalStatus) {
        return res.status(400).json({
          success: false,
          message: "Pedido já está no status final",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
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
