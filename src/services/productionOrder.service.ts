import { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IProductionOrder,
  IProductionOrderCreate,
  IProductionOrderUpdate,
} from "../types/productionOrder.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import dotenv from "dotenv";

dotenv.config();

class ProductionOrderService {
  constructor(private prisma: PrismaClient) {}

  async getAllProductionOrders(): Promise<IProductionOrder[]> {
    const allproductionorders: IProductionOrder[] =
      await this.prisma.production_order.findMany();

    if (allproductionorders.length < 1)
      throw new Error("Nenhuma ordem de produção encontrada.");

    return allproductionorders;
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

    const updatedProductionOrder: IProductionOrder =
      await this.prisma.production_order.update({
        where: {
          production_order_id,
        },
        data: productionOrderUpdatedFields,
      });

    return updatedProductionOrder;
  }
}

export default ProductionOrderService;
