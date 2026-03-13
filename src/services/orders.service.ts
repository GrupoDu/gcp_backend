import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IOrder,
  IOrderCreate,
  IOrderUpdate,
  OrderStatus,
} from "../types/orders.interface.js";

export default class OrdersService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getOrders() {
    return this.prisma.orders.findMany({
      orderBy: {
        order_status: "asc",
      },
    });
  }

  async getOrderById(order_id: string) {
    return this.prisma.orders.findUnique({
      where: { order_id },
    });
  }

  async createOrder(order: IOrderCreate) {
    return this.prisma.orders.create({
      data: {
        ...order,
        order_status: order.order_status || "Ainda não confirmado",
      },
    });
  }

  async updateOrder(order_id: string, orderUpdatedFields: IOrderUpdate) {
    const updateData = Object.fromEntries(
      Object.entries(orderUpdatedFields).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    if (Object.keys(updateData).length === 0) {
      return this.getOrderById(order_id);
    }

    return this.prisma.orders.update({
      where: { order_id },
      data: updateData,
    });
  }

  async updateOrderStatus(
    order_id: string,
  ): Promise<{ order: IOrder; nextStatus: OrderStatus }> {
    const currentOrder = await this.getOrderById(order_id);
    if (!currentOrder) {
      throw new Error("Order not found");
    }

    const statusFlow: OrderStatus[] = [
      "Ainda não confirmado",
      "Em produção",
      "Disponível",
      "Enviado",
      "Produzido",
      "Finalizado",
    ];

    const currentIndex = statusFlow.indexOf(
      currentOrder.order_status as OrderStatus,
    );

    const isFinalStatus = currentIndex === statusFlow.length - 1;

    if (currentIndex === -1) {
      throw new Error("Invalid current status");
    }

    if (isFinalStatus) {
      throw new Error("Order is already in final status");
    }

    const nextStatus = statusFlow[currentIndex + 1];

    if (!nextStatus) throw new Error("Invalid next status");

    const updatedOrder: IOrder = await this.prisma.orders.update({
      where: { order_id },
      data: { order_status: nextStatus },
    });

    return { order: updatedOrder, nextStatus };
  }
}
