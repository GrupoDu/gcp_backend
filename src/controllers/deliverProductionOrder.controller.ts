import type { Request, Response } from "express";
import type DeliverProductionOrderService from "../services/deliverProductionOrder.service.js";
import { responseMessages } from "../constants/messages.constants.js";

class DeliverProductionOrderController {
  private deliverProductionOrderService: DeliverProductionOrderService;

  constructor(deliverProductionOrderService: DeliverProductionOrderService) {
    this.deliverProductionOrderService = deliverProductionOrderService;
  }

  async deliverProductionOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { production_order_id } = req.params;
      const { delivered_product_quantity, requested_product_quantity } =
        req.body;

      if (!production_order_id) {
        return res
          .status(400)
          .json({ message: "ID da ordem de produção não fornecido." });
      }

      if (!delivered_product_quantity || !requested_product_quantity) {
        return res
          .status(400)
          .json({ message: responseMessages.fillAllFieldMessage });
      }

      const deliveredProductionOrder =
        await this.deliverProductionOrderService.deliverProductionOrder(
          production_order_id as string,
          delivered_product_quantity as number,
          requested_product_quantity as number,
        );

      return res.status(200).json({
        message: "Ordem de produção entregue com sucesso.",
        update: deliveredProductionOrder,
      });
    } catch (err) {
      const error = err as Error;

      if (error.message.includes("não concluíram"))
        return res.status(400).json({
          message: error.message,
        });

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }
}

export default DeliverProductionOrderController;
