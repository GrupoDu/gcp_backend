import type { Request, Response } from "express";
import type DeliverProductionOrderService from "../services/deliverProductionOrder.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

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
      const deliveryData = {
        delivered_product_quantity,
        requested_product_quantity,
      };

      if (isMissingFields(deliveryData) || !production_order_id) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE([
                "delivered_product_quantity",
                "requested_product_quantity",
                "prodution_order_id",
              ]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const deliveredProductionOrder =
        await this.deliverProductionOrderService.deliverProductionOrder(
          production_order_id as string,
          delivered_product_quantity as number,
          requested_product_quantity as number,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            deliveredProductionOrder,
            "Ordem de produção entregue com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;

      if (error.message.includes("não concluíram"))
        return res.status(400).json(errorResponseWith(error.message, 400));

      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default DeliverProductionOrderController;
