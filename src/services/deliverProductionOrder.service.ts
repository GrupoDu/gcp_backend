import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IProductionOrder } from "../types/productionOrder.interface.js";
import AssistantsPoRegistersService from "./assistantsPoRegisters.service.js";

/**
 * Service responsável por entregar uma ordem de produção.
 * @see DeliverProductionOrderController
 * @see AssistantsPoRegistersService
 * @method deliverProductionOrder
 */
class DeliverProductionOrderService {
  private _prisma: PrismaClient;
  private assistantsPoRegistersService: AssistantsPoRegistersService;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
    this.assistantsPoRegistersService = new AssistantsPoRegistersService(
      prisma,
    );
  }

  async deliverProductionOrder(
    production_order_id: string,
    delivered_product_quantity: number,
    requested_product_quantity: number,
  ): Promise<IProductionOrder> {
    this.verifyDeliveredProductQuantity(
      delivered_product_quantity,
      requested_product_quantity,
    );

    const areAllAssistantsDone =
      await this.assistantsPoRegistersService.isEveryAssistantsPORegistersDone(
        production_order_id,
      );

    if (!areAllAssistantsDone) {
      throw new Error(
        "Não é possível entregar a ordem de produção. Existem assistentes que ainda não concluíram suas tarefas.",
      );
    }

    const deliveredProductOrder: IProductionOrder =
      await this._prisma.production_order.update({
        data: {
          delivered_at: new Date(),
          delivered_product_quantity: delivered_product_quantity,
          production_order_status: "Entregue",
        },
        where: {
          production_order_id: production_order_id,
        },
      });

    return deliveredProductOrder;
  }

  private verifyDeliveredProductQuantity(
    delivered_product_quantity: number,
    requested_product_quantity: number,
  ) {
    if (delivered_product_quantity > requested_product_quantity) {
      throw new Error(
        "Quantidade entregue maior que a quantidade requisitada.",
      );
    }
  }
}

export default DeliverProductionOrderService;
