import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IOrderItems,
  IOrderItemsCreate,
} from "../types/orderItems.interface.js";

/**
 * Service responsável por gerenciar itens de pedidos.
 */
export default class OrderItemsService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca itens de um pedido
   */
  async getOrderItems(order_uuid: string): Promise<IOrderItems[]> {
    return this._prisma.order_items.findMany({
      where: { order_uuid },
    });
  }

  /**
   * Adiciona um item ao pedido
   */
  async addItemsToOrder(
    orderItemsDetails: IOrderItemsCreate,
    order_uuid: string,
  ): Promise<IOrderItems> {
    return this._prisma.order_items.create({
      data: {
        product_uuid: orderItemsDetails.product_uuid,
        order_uuid,
        unit_price: orderItemsDetails.unit_price,
        quantity: orderItemsDetails.quantity,
        total: orderItemsDetails.unit_price * orderItemsDetails.quantity,
      },
    });
  }

  /**
   * Remove um item do pedido
   */
  async removeItemFromOrder(
    order_uuid: string,
    product_uuid: string,
  ): Promise<string> {
    const deletedItem = await this._prisma.order_items.deleteMany({
      where: {
        order_uuid,
        product_uuid,
      },
    });

    if (deletedItem.count === 0)
      throw new Error("Item do pedido não encontrado");

    return "Item removido do pedido com sucesso";
  }
}
