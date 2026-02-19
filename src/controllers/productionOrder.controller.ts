import type { Request, Response } from "express";
import type ProductionOrderService from "../services/productionOrder.service.ts";
import { responseMessages } from "../constants/messages.constants.ts";

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
    const { uuid } = req.params;

    try {
      if (!uuid) throw new Error("id do registro não informado.");

      const targetTask =
        await this.productionOrderService.getProductionOrderById(
          uuid as string,
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
      const { uuid } = req.params;

      if (!uuid)
        return res
          .status(422)
          .json({ message: responseMessages.fillAllFieldMessage });

      await this.productionOrderService.removeProductionOrder(uuid as string);

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
      const { uuid } = req.params;

      const updatedProductionOrder =
        await this.productionOrderService.updateProductionOrder(
          ProductionOrderNewValues,
          uuid as string,
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
}

export default ProductionOrderController;
