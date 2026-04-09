import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IOrderItemsDetails,
  IOrderItemsCreate,
} from "../types/orderItems.interface.js";

/**
 * Service responsável por gerenciar itens de pedidos.
 *
 * @class OrderItemsService
 * @see OrderItemsController
 */
export default class OrderItemsService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca itens de um pedido
   *
   * @param {string} order_id
   * @see {IOrderItemsDetails}
   * @returns {Promise<IOrderItemsDetails[]>} - Array de itens de pedido
   */
  async getOrderItems(order_id: string): Promise<IOrderItemsDetails[]> {
    return this._prisma.order_items.findMany({
      where: { order_id },
    });
  }

  /**
   * Adiciona um item ao pedido
   *
   * @param {IOrderItemsCreate} orderItemsDetails - Detalhes do item a ser adicionado
   * @param {string} order_id - ID do pedido
   * @see {IOrderItemsCreate}
   * @see {IOrderItemsDetails}
   * @returns {Promise<IOrderItemsDetails>} - Item adicionado ao pedido
   */
  async addItemsToOrder(
    orderItemsDetails: IOrderItemsCreate,
    order_id: string,
  ): Promise<IOrderItemsDetails> {
    return this._prisma.order_items.create({
      data: {
        product_id: orderItemsDetails.product_id,
        order_id,
        unit_price: orderItemsDetails.unit_price,
        quantity: orderItemsDetails.quantity,
      },
    });
  }

  /**
   * Remove um item do pedido
   *
   * @param {string} order_id - ID do pedido
   * @param {string} product_id - ID do produto
   * @returns {Promise<string>} - Mensagem de sucesso
   */
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
