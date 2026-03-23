import type { Request, Response } from "express";
import type ProductionOrderService from "../services/productionOrder.service.js";
import { responseMessages } from "../constants/messages.constants.js";

class ProductionOrderController {
  private productionOrderService: ProductionOrderService;

  constructor(productionOrderService: ProductionOrderService) {
    this.productionOrderService = productionOrderService;
  }

  async getAllProductionRegisters(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allProductionRegisters =
        await this.productionOrderService.getAllProductionOrders();

      return res.status(200).json(allProductionRegisters);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async getProductionOrderById(req: Request, res: Response): Promise<Response> {
    const { production_order_id } = req.params;

    try {
      if (!production_order_id)
        throw new Error("id do registro não informado.");

      const targetTask =
        await this.productionOrderService.getProductionOrderById(
          production_order_id as string,
        );

      return res.status(200).json(targetTask);
    } catch (err) {
      return res.status(500).json({
        message: "Erro interno de servidor.",
        error: (err as Error).message,
      });
    }
  }

  async createNewProductionOrder(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const newTaskValues = req.body;

      const newTask =
        await this.productionOrderService.createNewProductionOrder(
          newTaskValues,
        );

      return res.status(201).json({
        message: "Ordem de produção criado com sucesso.",
        register: newTask,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async removeTask(req: Request, res: Response): Promise<Response> {
    try {
      const { production_order_id } = req.params;

      if (!production_order_id)
        return res
          .status(422)
          .json({ message: responseMessages.fillAllFieldMessage });

      await this.productionOrderService.removeProductionOrder(
        production_order_id as string,
      );

      return res
        .status(200)
        .json({ message: "Ordem de produção deletada com sucesso. " });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async updateProductionOrder(req: Request, res: Response): Promise<Response> {
    try {
      const ProductionOrderNewValues = req.body;
      const { production_order_id } = req.params;

      const updatedProductionOrder =
        await this.productionOrderService.updateProductionOrder(
          ProductionOrderNewValues,
          production_order_id as string,
        );

      return res.status(200).json({
        message: "Registro atualizado com sucesso.",
        update: updatedProductionOrder,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async deliverProductionOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { production_order_id } = req.params;
      const { delivered_product_quantity, requested_product_quantity } =
        req.body;

      const deliveredProductionOrder =
        await this.productionOrderService.deliverProductionOrder(
          production_order_id as string,
          delivered_product_quantity as number,
          requested_product_quantity as number,
        );

      return res.status(200).json({
        message: "Ordem de produção entregue com sucesso.",
        update: deliveredProductionOrder,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async stockProductionValidation(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { production_order_id } = req.params;

    try {
      if (!production_order_id)
        throw new Error("Id da ordem de produção não informado.");

      await this.productionOrderService.stockProductionValidation(
        production_order_id as string,
      );

      return res.status(200).json({
        message: "Validação de estoque realizada com sucesso.",
      });
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }
}

export default ProductionOrderController;
