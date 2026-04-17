import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IOrder,
  IOrderCreate,
  IOrderUpdate,
} from "../types/orders.interface.js";
import type {
  IProductionOrder,
  IProductionOrderCreate,
} from "../types/productionOrder.interface.js";
import ProductionOrderService from "./productionOrder.service.js";
import { getTodayDate } from "../utils/getTodayDate.js";
import debbugLogger from "../utils/debugLogger.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import type { PrismaTransactionClient } from "../../lib/prisma.js";

/**
 * Service responsável por gerenciar pedidos.
 *
 * @class OrdersService
 * @see OrdersController
 */
export default class OrdersService {
  private _prisma: PrismaClient;
  private _productionOrderService: ProductionOrderService;
  private static readonly FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
    this._productionOrderService = new ProductionOrderService(prisma);
  }

  /**
   * Busca todos os pedidos
   *
   * @see {IOrder}
   * @returns {Promise<IOrder[]>} Array de pedidos
   */
  async getOrders(): Promise<IOrder[]> {
    return this._prisma.orders.findMany({
      orderBy: {
        order_status: "asc",
      },
    });
  }

  /**
   * Busca um pedido pelo ID
   *
   * @param {string} order_id - ID do pedido
   * @see {IOrder}
   * @returns {Promise<IOrder>} - Pedido encontrado
   */
  async getOrderById(order_id: string): Promise<IOrder> {
    const targetOrder: IOrder | null = await this._prisma.orders.findUnique({
      where: { order_id },
    });

    if (!targetOrder) throw new Error("Pedido não encontrado");

    return targetOrder;
  }

  /**
   * Cria um pedido
   *
   * @returns {Promise<IOrder>} - Pedido criado
   * @param {IOrderCreate} order - Detalhes do pedido
   * @see {IOrderCreate}
   * @see {IOrder}
   */
  async createOrder(order: IOrderCreate): Promise<IOrder> {
    return this._prisma.orders.create({
      data: {
        ...order,
        order_status: "Ainda não confirmado",
      },
    });
  }

  /**
   * Atualiza um pedido
   *
   * @param {string} order_id - ID do pedido
   * @param {IOrderUpdate} orderUpdatedFields - Campos do pedido para atualizar
   * @returns {Promise<IOrder>} - Pedido atualizado
   * @see {IOrderUpdate}
   * @see {getOrderById}
   * @see {removeUndefinedUpdateFields}
   */
  async updateOrder(
    order_id: string,
    orderUpdatedFields: IOrderUpdate,
  ): Promise<IOrder> {
    const updatedFields = removeUndefinedUpdateFields(orderUpdatedFields);
    const hasNoFieldsToUpdate = Object.keys(updatedFields).length === 0;

    if (hasNoFieldsToUpdate) return this.getOrderById(order_id);

    return this._prisma.orders.update({
      where: { order_id },
      data: updatedFields,
    });
  }

  /**
   * Atualiza o status de um pedido
   *
   * @param {string} order_id - ID do pedido
   * @param {string} order_status - Status seguinte
   * @param {IProductionOrderCreate[]} productionOrders - Ordens de produção
   * @param {PrismaTransactionClient} tx - Transaction
   * @returns {Promise<IOrder>} - Pedido atualizado
   * @see {IProductionOrderCreate}
   * @see {getOrderById}
   * @see {removeUndefinedUpdateFields}
   */
  async updateOrderStatus(
    order_id: string,
    order_status: string,
    productionOrders: IProductionOrderCreate[],
    tx?: PrismaTransactionClient,
  ): Promise<IOrder> {
    const currentOrder: IOrder = await this.getOrderById(order_id);
    if (!currentOrder) throw new Error("Pedido não encontrado");

    enum statusTypes {
      notConfirmed = "Ainda não confirmado",
      inProduction = "Em produção",
      available = "Disponível",
      sent = "Enviado",
      produced = "Produzido",
      finished = "Finalizado",
    }

    const isStatusValid: boolean = Object.values(statusTypes).includes(
      order_status as statusTypes,
    );

    if (!isStatusValid) throw new Error("Invalid status");

    if (order_status === "Em produção") {
      return this.sendOrderToProduction(
        order_id,
        order_status,
        productionOrders,
      );
    }

    if (tx) {
      return tx.orders.update({
        where: { order_id },
        data: { order_status },
      });
    }

    return this._prisma.orders.update({
      where: { order_id },
      data: { order_status },
    });
  }

  /**
   * Envia itens do pedido para produção
   *
   * @param {string} order_id - ID do pedido
   * @param {string} order_status - Status
   * @param {IProductionOrderCreate[]} productionOrders - Itens do pedido para produção
   * @see {IProductionOrderCreate}
   * @see {updateOrderStatus}
   * @see {ProductionOrderService}
   * @private
   */
  private async sendOrderToProduction(
    order_id: string,
    order_status: string,
    productionOrders: IProductionOrderCreate[],
  ) {
    return this._prisma.$transaction(async (tx) => {
      // Atualizar diretamente o status do pedido para evitar recursão
      const updatedOrder = await tx.orders.update({
        where: { order_id },
        data: { order_status },
      });

      const oldProductionOrders =
        await this._productionOrderService.getProductionOrdersByOrderId(
          order_id,
          tx,
        );

      debbugLogger(
        [`oldProductionOrders: ${JSON.stringify(oldProductionOrders)}`],
        "||> sendOrderToProduction <||",
      );

      const hasNoOldProductionOrders = oldProductionOrders.length === 0;
      if (hasNoOldProductionOrders) {
        await this.createProductionOrdersForOrderItems(
          productionOrders,
          order_id,
          tx,
        );
      }

      const notDeliveredProductionOrders = oldProductionOrders.filter(
        (production) => production.production_order_status === "Não entregue",
      );

      await this.removeOldProductionOrders(
        notDeliveredProductionOrders,
        order_id,
        tx,
      );

      await this.recreateNotDeliveredProductionOrders(
        notDeliveredProductionOrders,
        order_id,
        tx,
      );

      return updatedOrder;
    });
  }

  /**
   * Recria as ordens de produção não entregues
   *
   * @param {IProductionOrder[]} notDeliveredProductionOrders - Ordens de produção não entregues
   * @param {string} order_id - ID do pedido
   * @param {PrismaTransactionClient} tx - Transaction
   * @see {getExtraDeadline}
   * @see {ProductionOrderService}
   * @private
   */
  private async recreateNotDeliveredProductionOrders(
    notDeliveredProductionOrders: IProductionOrder[],
    order_id: string,
    tx?: PrismaTransactionClient,
  ) {
    const newStatusAndDeadline = {
      production_order_status: "Pendente",
      production_order_deadline: new Date(this.getExtraDeadline()),
    };

    await Promise.all(
      notDeliveredProductionOrders.map((production) =>
        this._productionOrderService.createProductionOrder(
          {
            ...production,
            ...newStatusAndDeadline,
            delivered_product_quantity: 0,
          },
          order_id,
          tx,
        ),
      ),
    );
  }

  /**
   * Cria ordens de produção para os itens do pedido
   *
   * @param {IProductionOrderCreate[]} productionOrders - Ordens de produção a serem criados
   * @param {string} order_id - ID do pedido
   * @param {PrismaTransactionClient} tx - Transaction
   * @see {ProductionOrderService}
   * @private
   */
  private async createProductionOrdersForOrderItems(
    productionOrders: IProductionOrderCreate[],
    order_id: string,
    tx?: PrismaTransactionClient,
  ) {
    await Promise.all(
      productionOrders.map((production) =>
        this._productionOrderService.createProductionOrder(
          production,
          order_id,
          tx,
        ),
      ),
    );
  }

  /**
   * Remove antigas ordens de produção não entregues
   *
   * @returns {Promise<void>}
   * @param {IProductionOrder[]} notDeliveredProductionOrders - Ordens de produção não entregues
   * @param {string} order_id - ID de pedido
   * @param {PrismaTransactionClient} tx - Transaction
   * @see {ProductionOrderService}
   * @private
   */
  private async removeOldProductionOrders(
    notDeliveredProductionOrders: IProductionOrder[],
    order_id: string,
    tx?: PrismaTransactionClient,
  ): Promise<void> {
    await Promise.all(
      notDeliveredProductionOrders.map((production) =>
        this._productionOrderService.removeProductionOrder(
          production.production_order_id,
          order_id,
          tx,
        ),
      ),
    );
  }

  /**
   * Adiciona 4 dias extras ao prazo
   *
   * @returns {number} - Deadline extra
   * @see {FOUR_DAYS}
   * @private
   */
  private getExtraDeadline(): number {
    return getTodayDate().getTime() + OrdersService.FOUR_DAYS;
  }
}
