import { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IProductionOrder,
  IProductionOrderCreate,
  IProductionOrderDeliver,
  IProductionOrderUpdate,
} from "../types/productionOrder.interface.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import dotenv from "dotenv";
import { io } from "../server.js";

dotenv.config();

class ProductionOrderService {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async getAllProductionOrders(): Promise<IProductionOrder[]> {
    return this._prisma.production_order.findMany({
      orderBy: { production_order_status: "desc" },
    });
  }

  async getProductionOrderById(production_order_id: string) {
    const targetProductionOrder: IProductionOrder | null =
      await this._prisma.production_order.findUnique({
        where: {
          production_order_id,
        },
      });

    if (!targetProductionOrder)
      throw new Error("Ordem de produção não encontrada.");

    return targetProductionOrder;
  }

  async createProductionOrder(
    newProductionOrderValues: IProductionOrderCreate,
  ) {
    const newProductionOrder: IProductionOrder =
      await this._prisma.production_order.create({
        data: newProductionOrderValues,
      });

    io.emit("productionOrderNotify", newProductionOrder);

    return newProductionOrder;
  }

  async removeProductionOrder(production_order_id: string): Promise<string> {
    await this._prisma.$transaction(async (tx) => {
      await tx.assistants_po_register.deleteMany({
        where: {
          production_order_uuid: production_order_id,
        },
      });

      await tx.production_order.delete({
        where: {
          production_order_id,
        },
      });
    });

    return "Ordem de produção deletada com sucesso.";
  }

  async updateProductionOrder(
    productionOrderNewValues: IProductionOrderUpdate,
    production_order_id: string,
  ): Promise<IProductionOrder> {
    const productionOrderUpdatedFields = removeUndefinedUpdateFields(
      productionOrderNewValues,
    );

    if (productionOrderUpdatedFields.length < 1)
      throw new Error("Nenhum campo fornecido.");

    this.verifyDeliveredProductQuantity(
      Number(productionOrderUpdatedFields.delivered_product_quantity),
      Number(productionOrderUpdatedFields.requested_product_quantity),
    );

    return this._prisma.production_order.update({
      where: {
        production_order_id,
      },
      data: productionOrderUpdatedFields,
    });
  }

  async deliverProductionOrder(
    productionOrder_id: string,
    delivered_product_quantity: number,
    requested_product_quantity: number,
  ): Promise<IProductionOrderDeliver> {
    this.verifyDeliveredProductQuantity(
      delivered_product_quantity,
      requested_product_quantity,
    );

    return this._prisma.production_order.update({
      data: {
        delivered_at: new Date(),
        delivered_product_quantity: delivered_product_quantity,
        production_order_status: "Entregue",
      },
      where: {
        production_order_id: productionOrder_id,
      },
    });
  }

  async stockProductionValidation(
    production_order_id: string,
  ): Promise<IProductionOrder> {
    return this._prisma.production_order.update({
      where: {
        production_order_id,
      },
      data: {
        stock_validation: true,
      },
    });
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
