import type { PrismaClient } from "../../generated/prisma/client.js";
import { getMonthRange } from "../utils/getMonthRange.util.js";
import type { IProductionAnalysis } from "../types/dataAnalysis.interface.js";

class ProductionOrderAnalysisService {
  constructor(private prisma: PrismaClient) {}

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
      actualMonth: getMonthRange(this.getTodayDate()).actualMonth,
      nextMonth: getMonthRange(this.getTodayDate()).nextMonth,
    };

    return fullDataAnalysis;
  }

  private async getDeliveredRegistersData(): Promise<number> {
    const deliveredRegistersQuantity = await this.prisma.production_order.count(
      {
        where: {
          production_order_status: "Entregue",
          production_order_deadline: {
            gte: getMonthRange(this.getTodayDate()).actualMonth,
            lt: getMonthRange(this.getTodayDate()).nextMonth,
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
            gte: getMonthRange(this.getTodayDate()).actualMonth,
            lt: getMonthRange(this.getTodayDate()).nextMonth,
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
            gte: getMonthRange(this.getTodayDate()).actualMonth,
            lt: getMonthRange(this.getTodayDate()).nextMonth,
          },
        },
      });

    return notDeliveredRegistersQuantity;
  }

  private getTodayDate() {
    return new Date();
  }
}

export default ProductionOrderAnalysisService;
