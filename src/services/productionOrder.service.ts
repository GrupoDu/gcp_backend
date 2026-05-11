import { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IProductionOrder,
  IProductionOrderCreate,
  IProductionOrderUpdate,
} from "../types/productionOrder.interface.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import dotenv from "dotenv";
import { io } from "../server.js";
import type { PrismaTransactionClient } from "../../lib/prisma.js";

dotenv.config();

/**
 * Service responsável por gerenciar ordens de produção.
 */
class ProductionOrderService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todas as ordens de produção.
   */
  async getAllProductionOrders(): Promise<IProductionOrder[]> {
    return this._prisma.production_orders.findMany({
      orderBy: { production_order_status: "desc" },
    });
  }

  /**
   * Busca uma ordem de produção por ID.
   */
  async getProductionOrderById(
    production_order_uuid: string,
  ): Promise<IProductionOrder> {
    const targetProductionOrder: IProductionOrder | null =
      await this._prisma.production_orders.findUnique({
        where: {
          production_order_uuid,
        },
      });

    if (!targetProductionOrder)
      throw new Error("Ordem de produção não encontrada.");

    return targetProductionOrder;
  }

  /**
   * Busca Ordem de produção por ID do pedido
   */
  async getProductionOrdersByOrderId(
    order_uuid: string,
    tx?: PrismaTransactionClient,
  ): Promise<IProductionOrder[]> {
    if (tx) {
      return tx.production_orders.findMany({
        where: { order_uuid },
      });
    }

    return this._prisma.production_orders.findMany({
      where: { order_uuid },
    });
  }

  /**
   * Cria uma ordem de produção.
   */
  async createProductionOrder(
    newProductionOrderValues: IProductionOrderCreate,
    order_id?: string,
    tx?: PrismaTransactionClient,
  ): Promise<IProductionOrder> {
    if (tx) {
      return tx.production_orders.create({
        data: {
          ...newProductionOrderValues,
          order_uuid: order_id ?? "",
          delivered_at: null,
        },
      });
    }

    const newProductionOrder = await this._prisma.production_orders.create({
      data: newProductionOrderValues,
    });

    io.emit("productionOrderNotify", newProductionOrder);

    return newProductionOrder;
  }

  /**
   * Remove uma ordem de produção.
   */
  async removeProductionOrder(
    production_order_uuid: string,
    order_uuid?: string,
    tx?: PrismaTransactionClient,
  ): Promise<string> {
    if (tx) {
      await tx.production_orders.delete({
        where: {
          production_order_uuid,
          order_uuid: order_uuid ?? "",
        },
      });

      return "Ordem de produção deletada com sucesso.";
    }

    await this._prisma.production_orders.delete({
      where: {
        production_order_uuid,
      },
    });

    return "Ordem de produção deletada com sucesso.";
  }

  /**
   * Atualiza uma ordem de produção.
   */
  async updateProductionOrder(
    productionOrderNewValues: IProductionOrderUpdate,
    production_order_uuid: string,
  ): Promise<IProductionOrder> {
    const productionOrderUpdatedFields = removeUndefinedUpdateFields(
      productionOrderNewValues,
    );
    const hasNoUpdateFields =
      Object.keys(productionOrderUpdatedFields).length < 1;

    if (hasNoUpdateFields) throw new Error("Nenhum campo fornecido.");

    if (
      productionOrderUpdatedFields.delivered_product_quantity !== undefined &&
      productionOrderUpdatedFields.quantity_to_produce !== undefined
    ) {
      this.verifyDeliveredProductQuantity(
        Number(productionOrderUpdatedFields.delivered_product_quantity),
        Number(productionOrderUpdatedFields.quantity_to_produce),
      );
    }

    return this._prisma.production_orders.update({
      where: {
        production_order_uuid,
      },
      data: productionOrderUpdatedFields,
    });
  }

  /**
   * Valida o estoque de produção.
   */
  async stockProductionValidation(
    production_order_uuid: string,
  ): Promise<IProductionOrder> {
    return this._prisma.production_orders.update({
      where: {
        production_order_uuid,
      },
      data: {
        stock_validation: true,
      },
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

export default ProductionOrderService;
