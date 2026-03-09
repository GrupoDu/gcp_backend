import type { PrismaClient } from "../../generated/prisma/client.js";
import { getMonthRange } from "../utils/getMonthRange.util.js";
import type { IProductionAnalysis } from "../types/dataAnalysis.interface.js";
import { getTodayDate } from "../utils/getTodayDate.js";

class ProductionOrderAnalysisService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async registerDataAnalysis(): Promise<IProductionAnalysis> {
    const [delivered, notDelivered, pending] = await Promise.all([
      this.getDeliveredRegistersData(),
      this.getNotDeliveredRegistersData(),
      this.getPendingRegistersData(),
    ]);

    const fullDataAnalysis: IProductionAnalysis = {
      deliveredRegisterQuantity: delivered,
      notDeliveredRegisterQuantity: notDelivered,
      pendingRegisterQuantity: pending,
      actualMonth: getMonthRange(getTodayDate()).actualMonth,
      nextMonth: getMonthRange(getTodayDate()).nextMonth,
    };

    return fullDataAnalysis;
  }

  private async getDeliveredRegistersData(): Promise<number> {
    const deliveredRegistersQuantity = await this.prisma.production_order.count(
      {
        where: {
          production_order_status: "Entregue",
          production_order_deadline: {
            gte: getMonthRange(getTodayDate()).actualMonth,
            lt: getMonthRange(getTodayDate()).nextMonth,
          },
        },
      },
    );

    return deliveredRegistersQuantity;
  }

  private async getNotDeliveredRegistersData(): Promise<number> {
    const notDeliveredRegistersQuantity =
      await this.prisma.production_order.count({
        where: {
          production_order_status: "Não entregue",
          production_order_deadline: {
            gte: getMonthRange(getTodayDate()).actualMonth,
            lt: getMonthRange(getTodayDate()).nextMonth,
          },
        },
      });

    return notDeliveredRegistersQuantity;
  }

  private async getPendingRegistersData(): Promise<number> {
    const notDeliveredRegistersQuantity =
      await this.prisma.production_order.count({
        where: {
          production_order_status: "Pendente",
          production_order_deadline: {
            gte: getMonthRange(getTodayDate()).actualMonth,
            lt: getMonthRange(getTodayDate()).nextMonth,
          },
        },
      });

    return notDeliveredRegistersQuantity;
  }
}

export default ProductionOrderAnalysisService;
