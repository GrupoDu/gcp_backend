import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IStockUpdates } from "../types/stockUpdates.interface.js";
import { io } from "../server.js";

/**
 * Service responsável por gerenciar atualizações de estoque.
 *
 * @class StockUpdatesService
 * @see StockUpdatesController
 */
class StockUpdatesService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca as últimas 10 atualizações de estoque.
   *
   * @returns {Promise<IStockUpdates[]>} - Array de atualizações de estoque
   * @see {IStockUpdates}
   */
  async getStockUpdates(): Promise<IStockUpdates[]> {
    return this._prisma.stock_updates.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Registra uma nova atualização de estoque.
   *
   * @param {string} product_quantity_title - Título da atualização de quantidade
   * @param {string} event - Descrição do evento
   * @returns {Promise<IStockUpdates>} - Atualização de estoque registrada
   * @see {IStockUpdates}
   */
  async registerStockUpdate(
    product_quantity_title: string,
    event: string,
  ): Promise<IStockUpdates> {
    const stockUpdate: IStockUpdates = await this._prisma.stock_updates.create({
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
