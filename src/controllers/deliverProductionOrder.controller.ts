import type { Request, Response } from "express";
import type DeliverProductionOrderService from "../services/deliverProductionOrder.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import { DeliverProductionOrderSchema } from "../schemas/deliverProductionOrder.schema.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import { hasValidString } from "../utils/hasValidString.js";

/**
 * Controller responsável por gerenciar a quantidade de produtos entregues.
 */
class DeliverProductionOrderController {
  private _deliverProductionOrderService: DeliverProductionOrderService;

  /** @param {DeliverProductionOrderService} deliverProductionOrderService - Serviço de entrega de produção */
  constructor(deliverProductionOrderService: DeliverProductionOrderService) {
    this._deliverProductionOrderService = deliverProductionOrderService;
  }

  /**
   * Método responsável por gerenciar a quantidade de produtos entregues.
   */
  async deliverProductionOrder(req: Request, res: Response): Promise<Response> {
    const { production_order_uuid } = req.params;
    const { delivered_product_quantity, quantity_to_produce } =
      req.body as IDeliverValuesType;
    const deliveryData = {
      delivered_product_quantity,
      quantity_to_produce,
    };
    const { isMissingFields, requiredFieldsMessage, schemaErr } =
      checkMissingFields(deliveryData, DeliverProductionOrderSchema);

    try {
      if (!hasValidString(production_order_uuid) || isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const deliveredProductionOrder =
        await this._deliverProductionOrderService.deliverProductionOrder(
          production_order_uuid,
          delivered_product_quantity,
          quantity_to_produce,
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
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

interface IDeliverValuesType {
  delivered_product_quantity: number;
  quantity_to_produce: number;
}

export default DeliverProductionOrderController;
