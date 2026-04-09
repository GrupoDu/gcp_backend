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
 *
 * @class ProductionOrderService
 * @see ProductionOrderController
 */
class ProductionOrderService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todas as ordens de produção.
   *
   * @returns {Promise<IProductionOrder[]>} Array de ordens de produção
   * @see {IProductionOrder}
   */
  async getAllProductionOrders(): Promise<IProductionOrder[]> {
    return this._prisma.production_order.findMany({
      orderBy: { production_order_status: "desc" },
    });
  }

  /**
   * Busca uma ordem de produção por ID.
   *
   * @param {string} production_order_id - ID da ordem de produção
   * @throws {Error} - Ordem de produção não encontrada
   * @returns {Promise<IProductionOrder>} - Ordem de produção
   */
  async getProductionOrderById(
    production_order_id: string,
  ): Promise<IProductionOrder> {
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

  /**
   * Busca Ordem de produção por ID do pedido
   *
   * @param {string} order_id - ID do pedido
   * @param {PrismaTransactionClient} tx - Transaction
   * @returns {Promise<IProductionOrder[]>} - Array de ordens de produção
   * @see {IProductionOrder}
   */
  async getProductionOrdersByOrderId(
    order_id: string,
    tx?: PrismaTransactionClient,
  ): Promise<IProductionOrder[]> {
    if (tx) {
      return tx.production_order.findMany({
        where: { order_id },
      });
    }

    return this._prisma.production_order.findMany({
      where: { order_id },
    });
  }

  /**
   * Cria uma ordem de produção.
   *
   * @param {IProductionOrderCreate} newProductionOrderValues - Dados da nova ordem de produção
   * @param {string} order_id - ID do pedido
   * @param {PrismaTransactionClient} tx - Transaction
   * @returns {Promise<IProductionOrder>} - Nova ordem de produção
   * @see {IProductionOrderCreate}
   */
  async createProductionOrder(
    newProductionOrderValues: IProductionOrderCreate,
    order_id?: string,
    tx?: PrismaTransactionClient,
  ): Promise<IProductionOrder> {
    if (tx) {
      return tx.production_order.create({
        data: { ...newProductionOrderValues, order_id: order_id ?? null },
      });
    }

    const newProductionOrder: IProductionOrder =
      await this._prisma.production_order.create({
        data: newProductionOrderValues,
      });

    io.emit("productionOrderNotify", newProductionOrder);

    return newProductionOrder;
  }

  /**
   * Remove uma ordem de produção.
   *
   * @param {string} production_order_id - ID da ordem de produção
   * @param {string} order_id - ID do pedido
   * @param {PrismaTransactionClient} tx - Transaction
   * @returns {Promise<string>} - Mensagem de sucesso
   * @see {PrismaTransactionClient}
   */
  async removeProductionOrder(
    production_order_id: string,
    order_id?: string,
    tx?: PrismaTransactionClient,
  ): Promise<string> {
    if (tx) {
      await tx.assistants_po_register.deleteMany({
        where: {
          production_order_uuid: production_order_id,
        },
      });

      await tx.production_order.delete({
        where: {
          production_order_id,
          order_id: order_id ?? null,
        },
      });

      return "Ordem de produção deletada com sucesso.";
    }

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

  /**
   * Atualiza uma ordem de produção.
   *
   * @param {IProductionOrderUpdate} productionOrderNewValues - Novos valores da ordem de produção
   * @param {string} production_order_id - ID da ordem de produção
   * @returns {Promise<IProductionOrder>} - Ordem de produção atualizada
   * @throws {Error} - Nenhum campo fornecido
   * @see {IProductionOrderUpdate}
   * @see {verifyDeliveredProductQuantity}
   */
  async updateProductionOrder(
    productionOrderNewValues: IProductionOrderUpdate,
    production_order_id: string,
  ): Promise<IProductionOrder> {
    const productionOrderUpdatedFields = removeUndefinedUpdateFields(
      productionOrderNewValues,
    );
    const hasNoUpdateFields = productionOrderUpdatedFields.length < 1;

    if (hasNoUpdateFields) throw new Error("Nenhum campo fornecido.");

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

  /**
   * Valida o estoque de produção.
   *
   * @param {string} production_order_id - ID da ordem de produção
   * @returns {Promise<IProductionOrder>} - Ordem de produção validada
   */
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

  /**
   * Verifica se a quantidade entregue é maior que a quantidade requisitada.
   *
   * @param {number} delivered_product_quantity - Quantidade entregue
   * @param {number} requested_product_quantity - Quantidade requisitada
   * @throws {Error} - Quantidade entregue maior que a quantidade requisitada
   * @private
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
