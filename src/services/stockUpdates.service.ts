import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IStockUpdates } from "../types/stockUpdates.interface.js";

class StockUpdatesService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getStockUpdates() {
    const stockUpdates = await this.prisma.stock_updates.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
    });
    return stockUpdates;
  }

  async registerStockUpdate(product_quantity_title: string, event: string) {
    const stockUpdate: IStockUpdates = await this.prisma.stock_updates.create({
      data: {
        product_quantity_title,
        event,
        date: new Date(),
      },
    });
    return stockUpdate;
  }
}

export default StockUpdatesService;
