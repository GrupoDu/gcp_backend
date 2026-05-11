import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IStockUpdates } from "../types/stockUpdates.interface.js";
import { io } from "../server.js";

/**
 * Service responsável por gerenciar atualizações de estoque.
 */
class StockUpdatesService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca as últimas 10 atualizações de estoque.
   */
  async getStockUpdates(): Promise<IStockUpdates[]> {
    return this._prisma.stock_updates.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Registra uma nova atualização de estoque.
   */
  async registerStockUpdate(
    product_quantity_title: string,
    event: string,
  ): Promise<IStockUpdates> {
    const stockUpdate = await this._prisma.stock_updates.create({
      data: {
        product_quantity_title,
        event,
        date: new Date(),
      },
    });

    io.emit("stockUpdate", stockUpdate);

    return stockUpdate;
  }
}

export default StockUpdatesService;
