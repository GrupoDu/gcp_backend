import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IProductionOrder } from "../types/productionOrder.interface.js";
import AssistantsPoRegistersService from "./assistantsPoRegisters.service.js";
import type { PrismaTransactionClient } from "../../lib/prisma.js";
import debbugLogger from "../utils/debugLogger.js";

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
    return this._prisma.$transaction(async (tx) => {
      const assistantsNotDefined = !(await this.hasAllAssistantsFilled(
        production_order_id,
        tx,
      ));

      if (assistantsNotDefined)
        throw new Error("Verifique se todos os assistentes foram definidos.");

      this.verifyDeliveredProductQuantity(
        delivered_product_quantity,
        requested_product_quantity,
      );

      const areAllAssistantsDone =
        await this.assistantsPoRegistersService.hasEveryAssistantPORegistersDone(
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
    });
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

  private async hasAllAssistantsFilled(
    production_order_id: string,
    tx: PrismaTransactionClient,
  ): Promise<boolean> {
    const assistantsCount = await tx.assistants_po_register.count({
      where: {
        production_order_uuid: production_order_id,
      },
    });

    debbugLogger([
      "Passando por verificação de assistentes...",
      `Validação passou como: ${assistantsCount}`,
    ]);

    return assistantsCount === 4;
  }
}

export default DeliverProductionOrderService;
