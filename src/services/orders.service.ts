import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IOrder,
  IOrderCreateInput,
  IOrderUpdate,
} from "../types/orders.interface.js";
import type {
  IProductionOrder,
  IProductionOrderCreate,
} from "../types/productionOrder.interface.js";
import ProductionOrderService from "./productionOrder.service.js";
import { getTodayDate } from "../utils/getTodayDate.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import type { PrismaTransactionClient } from "../../lib/prisma.js";

/**
 * Service responsável por gerenciar pedidos.
 */
export default class OrdersService {
  private _prisma: PrismaClient;
  private _productionOrderService: ProductionOrderService;
  private static readonly FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;

  private readonly _includeData = {
    billing: true,
    revenue: true,
    delivery: true,
    clients: true,
    order_items: {
      include: {
        products: true,
      },
    },
  };

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
    this._productionOrderService = new ProductionOrderService(prisma);
  }

  /**
   * Busca todos os pedidos
   */
  async getOrders(): Promise<IOrder[]> {
    const orders = await this._prisma.orders.findMany({
      include: this._includeData,
      orderBy: {
        order_status: "asc",
      },
    });

    return orders as unknown as IOrder[];
  }

  /**
   * Busca um pedido pelo ID
   */
  async getOrderById(order_uuid: string): Promise<IOrder> {
    const targetOrder = await this._prisma.orders.findUnique({
      where: { order_uuid },
      include: this._includeData,
    });

    if (!targetOrder) throw new Error("Pedido não encontrado");

    return targetOrder as unknown as IOrder;
  }

  /**
   * Cria um pedido
   */
  async createOrder(orderData: IOrderCreateInput): Promise<IOrder> {
    const {
      billing_uuid,
      revenue_uuid,
      client_uuid,
      order_deadline,
      order_items,
      delivery,
    } = orderData;

    const newOrder = await this._prisma.orders.create({
      data: {
        order_deadline: new Date(order_deadline),
        order_status: "Pendente",
        billing: { connect: { billing_uuid } },
        revenue: { connect: { revenue_uuid } },
        clients: { connect: { client_uuid } },
        delivery: { create: delivery },
        order_items: {
          create: order_items.map((item) => ({
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_percentage: item.discount_percentage ?? 0,
            ipi: item.ipi ?? 0,
            additional_amount: item.additional_amount ?? 0,
            total: this.calculateProductTotalPrice(
              item.quantity,
              item.unit_price,
              item.discount_percentage,
              item.ipi,
              item.additional_amount,
            ),
            product_uuid: item.product_uuid,
          })),
        },
        totalPrice: this.calculateFinalPrice(order_items),
      },
      include: this._includeData,
    });

    return newOrder as unknown as IOrder;
  }

  /**
   * Atualiza um pedido
   */
  async updateOrder(
    order_uuid: string,
    orderUpdatedFields: IOrderUpdate,
  ): Promise<IOrder> {
    const updatedFields = removeUndefinedUpdateFields(orderUpdatedFields);
    const hasNoFieldsToUpdate = Object.keys(updatedFields).length === 0;

    if (hasNoFieldsToUpdate) return this.getOrderById(order_uuid);

    return this._prisma.orders.update({
      where: { order_uuid },
      data: updatedFields,
    }) as unknown as IOrder;
  }

  /**
   * Atualiza o status de um pedido
   */
  async updateOrderStatus(
    order_uuid: string,
    order_status: string,
    productionOrders: IProductionOrderCreate[],
    tx?: PrismaTransactionClient,
  ): Promise<IOrder> {
    const currentOrder: IOrder = await this.getOrderById(order_uuid);
    if (!currentOrder) throw new Error("Pedido não encontrado");

    enum statusTypes {
      pending = "Pendente",
      inProduction = "Em produção",
      available = "Disponível",
      sent = "Enviado",
      produced = "Produzido",
      delivered = "Entregue",
    }

    const isStatusValid: boolean = Object.values(statusTypes).includes(
      order_status as statusTypes,
    );

    if (!isStatusValid) throw new Error("Invalid status");

    if (order_status === "Em produção") {
      return this.sendOrderToProduction(
        order_uuid,
        order_status,
        productionOrders,
      ) as unknown as IOrder;
    }

    if (tx) {
      return tx.orders.update({
        where: { order_uuid },
        data: { order_status },
      }) as unknown as IOrder;
    }

    return this._prisma.orders.update({
      where: { order_uuid },
      data: { order_status },
    }) as unknown as IOrder;
  }

  /**
   * Envia itens do pedido para produção
   */
  private async sendOrderToProduction(
    order_uuid: string,
    order_status: string,
    productionOrders: IProductionOrderCreate[],
  ) {
    return this._prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.orders.update({
        where: { order_uuid },
        data: { order_status },
      });

      const oldProductionOrders =
        await this._productionOrderService.getProductionOrdersByOrderId(
          order_uuid,
          tx,
        );

      const hasNoOldProductionOrders = oldProductionOrders.length === 0;
      if (hasNoOldProductionOrders) {
        await this.createProductionOrdersForOrderItems(
          productionOrders,
          order_uuid,
          tx,
        );
      }

      const notDeliveredProductionOrders = oldProductionOrders.filter(
        (production) => production.production_order_status === "Não entregue",
      );

      await this.removeOldProductionOrders(
        notDeliveredProductionOrders,
        order_uuid,
        tx,
      );

      await this.recreateNotDeliveredProductionOrders(
        notDeliveredProductionOrders,
        order_uuid,
        tx,
      );

      return updatedOrder;
    });
  }

  /**
   * Recria as ordens de produção não entregues
   */
  private async recreateNotDeliveredProductionOrders(
    notDeliveredProductionOrders: IProductionOrder[],
    order_uuid: string,
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
          order_uuid,
          tx,
        ),
      ),
    );
  }

  /**
   * Cria ordens de produção para os itens do pedido
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
   */
  private async removeOldProductionOrders(
    notDeliveredProductionOrders: IProductionOrder[],
    order_uuid: string,
    tx?: PrismaTransactionClient,
  ): Promise<void> {
    await Promise.all(
      notDeliveredProductionOrders.map((production) =>
        this._productionOrderService.removeProductionOrder(
          production.production_order_uuid,
          order_uuid,
          tx,
        ),
      ),
    );
  }

  private calculateProductTotalPrice(
    quantity: number,
    unit_price: number,
    discount_percentage?: number,
    additional_amount?: number,
    ipi?: number,
  ) {
    const price = quantity * unit_price;
    const discount = discount_percentage ? discount_percentage / 100 : 0;
    const additional = additional_amount ? additional_amount / 100 : 0;
    return price - discount + (ipi || 0) + additional;
  }

  private calculateFinalPrice(
    products: Array<{
      product_uuid: string;
      quantity: number;
      unit_price: number;
      discount_percentage?: number;
      ipi?: number;
      additional_amount?: number;
      total: number;
    }>,
  ) {
    return products.reduce((total, product) => {
      return total + product.total;
    }, 0);
  }

  private getExtraDeadline(): number {
    return getTodayDate().getTime() + OrdersService.FOUR_DAYS;
  }
}
