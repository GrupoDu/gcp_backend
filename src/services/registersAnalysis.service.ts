import type { PrismaClient } from "../../generated/prisma/client.js";
import { getMonthRange } from "../utils/getMonthRange.util.js";
import type { IProductionAnalysis } from "../types/dataAnalysis.interface.js";

class RegisterAnalysisService {
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
    const deliveredRegistersQuantity = await this.prisma.register.count({
      where: {
        status: "Entregue",
        deadline: {
          gte: getMonthRange(this.getTodayDate()).actualMonth,
          lt: getMonthRange(this.getTodayDate()).nextMonth,
        },
      },
    });

    return deliveredRegistersQuantity;
  }

  private async getNotDeliveredRegistersData(): Promise<number> {
    const notDeliveredRegistersQuantity = await this.prisma.register.count({
      where: {
        status: "Não entregue",
        deadline: {
          gte: getMonthRange(this.getTodayDate()).actualMonth,
          lt: getMonthRange(this.getTodayDate()).nextMonth,
        },
      },
    });

    return notDeliveredRegistersQuantity;
  }

  private async getPendingRegistersData(): Promise<number> {
    const notDeliveredRegistersQuantity = await this.prisma.register.count({
      where: {
        status: "Pendente",
        deadline: {
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

export default RegisterAnalysisService;
