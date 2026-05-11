import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IProductionAnalysis } from "../types/dataAnalysis.interface.js";
import { getTodayDate } from "../utils/getTodayDate.js";
import { getMonthRange } from "../utils/getMonthRange.util.js";

/**
 * Service responsável por gerenciar análises de produção.
 */
class ProductionOrderAnalysisService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Realiza análise de dados de produção.
   */
  async productionOrderDataAnalysis(): Promise<IProductionAnalysis> {
    const [delivered, notDelivered, pending] = await Promise.all([
      this.getDeliveredRegistersData(),
      this.getNotDeliveredRegistersData(),
      this.getPendingRegistersData(),
    ]);

    return {
      deliveredRegisterQuantity: delivered,
      notDeliveredRegisterQuantity: notDelivered,
      pendingRegisterQuantity: pending,
      actualMonth: getMonthRange(getTodayDate()).actualMonth,
      nextMonth: getMonthRange(getTodayDate()).nextMonth,
    };
  }

  private async getDeliveredRegistersData(): Promise<number> {
    return this._prisma.production_orders.count({
      where: {
        production_order_status: "Entregue",
        production_order_deadline: {
          gte: getMonthRange(getTodayDate()).actualMonth,
          lt: getMonthRange(getTodayDate()).nextMonth,
        },
      },
    });
  }

  private async getNotDeliveredRegistersData(): Promise<number> {
    return this._prisma.production_orders.count({
      where: {
        production_order_status: "Não entregue",
        production_order_deadline: {
          gte: getMonthRange(getTodayDate()).actualMonth,
          lt: getMonthRange(getTodayDate()).nextMonth,
        },
      },
    });
  }

  private async getPendingRegistersData(): Promise<number> {
    return this._prisma.production_orders.count({
      where: {
        production_order_status: "Pendente",
        production_order_deadline: {
          gte: getMonthRange(getTodayDate()).actualMonth,
          lt: getMonthRange(getTodayDate()).nextMonth,
        },
      },
    });
  }
}

export default ProductionOrderAnalysisService;
