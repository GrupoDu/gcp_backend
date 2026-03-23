import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IInOutStockAnalysis } from "../types/inOutStockAnalysis.interface.js";
import { io } from "../server.js";

class InOutStockService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getInOutStockAnalysis() {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    const inOutStockAnalysis: IInOutStockAnalysis[] =
      await this.prisma.in_out_stock.findMany({
        where: { month: MONTH, year: YEAR },
        select: {
          in_quantity: true,
          out_quantity: true,
          month: true,
          year: true,
        },
      });
    return inOutStockAnalysis;
  }

  async incrementMonthlyInStockQuantity(quantity: number) {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    const updatedInStockQuantityAnalysis =
      await this.prisma.in_out_stock.updateMany({
        where: { month: MONTH, year: YEAR },
        data: { in_quantity: { increment: quantity } },
      });

    io.emit("inStock", quantity);

    return updatedInStockQuantityAnalysis;
  }

  async incrementMonthlyOutStockQuantity(quantity: number) {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    const updatedOutStockQuantityAnalysis =
      await this.prisma.in_out_stock.updateMany({
        where: { month: MONTH, year: YEAR },
        data: { out_quantity: { increment: quantity } },
      });

    io.emit("outStock", quantity);

    return updatedOutStockQuantityAnalysis;
  }
}

export default InOutStockService;
