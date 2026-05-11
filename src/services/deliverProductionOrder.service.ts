import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IProductionOrder } from "../types/productionOrder.interface.js";

/**
 * Service responsável por entregar uma ordem de produção.
 */
class DeliverProductionOrderService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Faz a entrega de uma ordem de produção.
   */
  async deliverProductionOrder(
    production_order_uuid: string,
    delivered_product_quantity: number,
    quantity_to_produce: number,
  ): Promise<IProductionOrder> {
    return this._prisma.$transaction(async (tx) => {
      this.verifyDeliveredProductQuantity(
        delivered_product_quantity,
        quantity_to_produce,
      );

      const deliveredProductOrder =
        await tx.production_orders.update({
          data: {
            delivered_at: new Date(),
            delivered_product_quantity: delivered_product_quantity,
            production_order_status: "Entregue",
          },
          where: {
            production_order_uuid,
          },
        });

      return deliveredProductOrder as unknown as IProductionOrder;
    });
  }

  /**
   * Verifica se a quantidade entregue é maior que a quantidade requisitada.
   */
  private verifyDeliveredProductQuantity(
    delivered_product_quantity: number,
    requested_product_quantity: number,
  ): void {
    if (delivered_product_quantity > requested_product_quantity) {
      throw new Error(
        "Quantidade entregue maior que a quantidade requisitada.",
      );
    }
  }
}

export default DeliverProductionOrderService;
