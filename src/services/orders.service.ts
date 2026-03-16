import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IOrder,
  IOrderCreate,
  IOrderUpdate,
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

  async getOrderById(order_id: string): Promise<IOrder> {
    const targetOrder: IOrder | null = await this.prisma.orders.findUnique({
      where: { order_id },
    });

    if (!targetOrder) throw new Error("Pedido não encontrado");

    return targetOrder;
  }

  async createOrder(order: IOrderCreate) {
    return this.prisma.orders.create({
      data: {
        ...order,
        order_status: "Ainda não confirmado",
      },
    });
  }

  async updateOrder(
    order_id: string,
    orderUpdatedFields: IOrderUpdate,
  ): Promise<IOrder> {
    const updateData: IOrderUpdate = Object.fromEntries(
      Object.entries(orderUpdatedFields).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    if (Object.keys(updateData).length === 0)
      return this.getOrderById(order_id);

    return this.prisma.orders.update({
      where: { order_id },
      data: updateData,
    });
  }

  async updateOrderStatus(order_id: string, status: string): Promise<IOrder> {
    const currentOrder: IOrder = await this.getOrderById(order_id);
    if (!currentOrder) {
      throw new Error("Order not found");
    }

    const statusTypes: string[] = [
      "Ainda não confirmado",
      "Em produção",
      "Disponível",
      "Enviado",
      "Produzido",
      "Finalizado",
    ];

    const isStatusValid: boolean = statusTypes.includes(status);

    if (!isStatusValid) throw new Error("Invalid status");

    return this.prisma.orders.update({
      where: { order_id },
      data: { order_status: status },
    });
  }
}
