import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IOrderItemsDetails,
  IOrderItemsCreate,
} from "../types/orderItems.interface.js";

/**
 * Service responsável por gerenciar itens de pedidos.
 * @see OrderItemsController
 * @method getOrderItems
 * @method addItemsToOrder
 * @method removeItemFromOrder
 */
export default class OrderItemsService {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async getOrderItems(order_id: string): Promise<IOrderItemsDetails[]> {
    const orderItems: IOrderItemsDetails[] =
      await this._prisma.order_items.findMany({
        where: { order_id },
      });

    return orderItems;
  }

  async addItemsToOrder(
    orderItemsDetails: IOrderItemsCreate,
    order_id: string,
  ): Promise<IOrderItemsDetails> {
    const newOrderItem: IOrderItemsDetails =
      await this._prisma.order_items.create({
        data: {
          product_id: orderItemsDetails.product_id,
          order_id,
          unit_price: orderItemsDetails.unit_price,
          quantity: orderItemsDetails.quantity,
        },
      });

    return newOrderItem;
  }

  async removeItemFromOrder(
    order_id: string,
    product_id: string,
  ): Promise<string> {
    const deletedItem = await this._prisma.order_items.deleteMany({
      where: {
        order_id,
        product_id,
      },
    });

    if (deletedItem.count === 0)
      throw new Error("Item do pedido não encontrado");

    return "Item removido do pedido com sucesso";
  }
}
