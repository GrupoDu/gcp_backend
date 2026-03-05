import { PrismaClient } from "../../generated/prisma/client.ts";
import type {
  IProductionOrder,
  IProductionOrderCreate,
  IProductionOrderDeliver,
  IProductionOrderUpdate,
} from "../types/productionOrder.interface.ts";
import { responseMessages } from "../constants/messages.constants.ts";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.ts";
import dotenv from "dotenv";
import { io } from "../server.ts";

dotenv.config();

class ProductionOrderService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllProductionOrders(): Promise<IProductionOrder[]> {
    const allProductionOrders: IProductionOrder[] =
      await this.prisma.production_order.findMany({
        orderBy: { production_order_status: "desc" },
      });

    return allProductionOrders;
  }

  async getProductionOrderById(production_order_id: string) {
    const targetProductionOrder: IProductionOrder | null =
      await this.prisma.production_order.findUnique({
        where: {
          production_order_id,
        },
      });

    if (!targetProductionOrder)
      throw new Error("Ordem de produção não encontrada.");

    return targetProductionOrder;
  }

  async createNewProductionOrder(
    newProductionOrderValues: IProductionOrderCreate,
  ) {
    if (!newProductionOrderValues)
      throw new Error(responseMessages.fillAllFieldMessage);

    const newProductionOrder: IProductionOrder =
      await this.prisma.production_order.create({
        data: newProductionOrderValues,
      });

    io.emit("productionOrderNotify", newProductionOrder);

    return newProductionOrder;
  }

  async removeProductionOrder(production_order_id: string): Promise<string> {
    if (!production_order_id)
      throw new Error(responseMessages.fillAllFieldMessage);

    await this.prisma.production_order.delete({
      where: {
        production_order_id,
      },
    });

    return "Ordem de produção deletada com sucesso.";
  }

  async updateProductionOrder(
    productionOrderNewValues: IProductionOrderUpdate,
    production_order_id: string,
  ): Promise<IProductionOrder> {
    if (!production_order_id)
      throw new Error(responseMessages.fillAllFieldMessage);

    const productionOrderUpdatedFields = removeUndefinedUpdateFields(
      productionOrderNewValues,
    );

    if (productionOrderUpdatedFields.length < 1)
      throw new Error("Nenhum campo fornecido.");

    this.verifyDeliveredProductQuantity(
      productionOrderUpdatedFields.delivered_product_quantity,
      productionOrderUpdatedFields.requested_product_quantity,
    );

    const updatedProductionOrder: IProductionOrder =
      await this.prisma.production_order.update({
        where: {
          production_order_id,
        },
        data: productionOrderUpdatedFields,
      });

    return updatedProductionOrder;
  }

  async deliverProductionOrder(
    productionOrder_id: string,
    delivered_product_quantity: number,
    requested_product_quantity: number,
  ): Promise<IProductionOrderDeliver> {
    if (
      !productionOrder_id ||
      !delivered_product_quantity ||
      !requested_product_quantity
    )
      throw new Error(responseMessages.fillAllFieldMessage);

    this.verifyDeliveredProductQuantity(
      delivered_product_quantity,
      requested_product_quantity,
    );

    const deliveredProductOrder: IProductionOrder | null =
      await this.prisma.production_order.update({
        data: {
          delivered_at: new Date(),
          delivered_product_quantity: delivered_product_quantity,
          production_order_status: "Entregue",
        },
        where: {
          production_order_id: productionOrder_id,
        },
      });

    return deliveredProductOrder;
  }

  private verifyDeliveredProductQuantity(
    delivered_product_quantity: number,
    requested_product_quantity: number,
  ) {
    if (delivered_product_quantity > requested_product_quantity)
      throw new Error(
        "Quantidade entregue maior que a quantidade requisitada.",
      );
  }
}

export default ProductionOrderService;
