import type { PrismaClient } from "../../generated/prisma/client.js";

class InOutStockService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getInOutStockAnalysis() {
    const inOutStockAnalysis = await this.prisma.in_out_stock.findMany();
    return inOutStockAnalysis;
  }

  async incrementMonthlyInStockQuantity() {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    const updatedProduct = await this.prisma.in_out_stock.updateMany({
      where: { month: MONTH, year: YEAR },
      data: { in_quantity: { increment: 1 } },
    });
    return updatedProduct;
  }

  async incrementMonthlyOutStockQuantity() {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    const updatedProduct = await this.prisma.in_out_stock.updateMany({
      where: { month: MONTH, year: YEAR },
      data: { out_quantity: { increment: 1 } },
    });
    return updatedProduct;
  }
}

export default InOutStockService;
