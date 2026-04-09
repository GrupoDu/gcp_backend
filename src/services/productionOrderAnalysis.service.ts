import type { PrismaClient } from "../../generated/prisma/client.js";
import { getMonthRange } from "../utils/getMonthRange.util.js";
import type { IProductionAnalysis } from "../types/dataAnalysis.interface.js";
import { getTodayDate } from "../utils/getTodayDate.js";

/**
 * Service responsável por gerenciar análises de produção.
 *
 * @class ProductionOrderAnalysisService
 * @see ProductionOrderAnalysisController
 */
class ProductionOrderAnalysisService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Realiza análise de dados de produção.
   *
   * @returns {Promise<IProductionAnalysis>} - Dados de análise de produção
   * @see {IProductionAnalysis}
   * @see {getDeliveredRegistersData}
   * @see {getNotDeliveredRegistersData}
   * @see {getPendingRegistersData}
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

  /**
   * Busca quantidade de registros entregues no mês atual.
   *
   * @returns {Promise<number>} - Quantidade de registros entregues
   * @private
   */
  private async getDeliveredRegistersData(): Promise<number> {
    return this._prisma.production_order.count({
      where: {
        production_order_status: "Entregue",
        production_order_deadline: {
          gte: getMonthRange(getTodayDate()).actualMonth,
          lt: getMonthRange(getTodayDate()).nextMonth,
        },
      },
    });
  }

  /**
   * Busca quantidade de registros não entregues no mês atual.
   *
   * @returns {Promise<number>} - Quantidade de registros não entregues
   * @private
   */
  private async getNotDeliveredRegistersData(): Promise<number> {
    return this._prisma.production_order.count({
      where: {
        production_order_status: "Não entregue",
        production_order_deadline: {
          gte: getMonthRange(getTodayDate()).actualMonth,
          lt: getMonthRange(getTodayDate()).nextMonth,
        },
      },
    });
  }

  /**
   * Busca quantidade de registros pendentes no mês atual.
   *
   * @returns {Promise<number>} - Quantidade de registros pendentes
   * @private
   */
  private async getPendingRegistersData(): Promise<number> {
    return this._prisma.production_order.count({
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
