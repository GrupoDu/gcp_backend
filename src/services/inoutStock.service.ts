import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IInOutStockAnalysis } from "../types/inOutStockAnalysis.interface.js";
import { io } from "../server.js";

/**
 * Service responsável por gerenciar análises de entrada e saída de estoque.
 *
 * @class InOutStockService
 * @see InOutStockController
 */
class InOutStockService {
  private _prisma: PrismaClient;
  private static MONTH: number = new Date().getMonth() + 1;
  private static YEAR: number = new Date().getFullYear();

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Analisa as entradas e saídas de estoque.
   *
   * @returns {Promise<IInOutStockAnalysis[]>} - Array de análises de entrada e saída de estoque
   * @see {InOutStockController}
   */
  async getInOutStockAnalysis(): Promise<IInOutStockAnalysis[]> {
    return this._prisma.in_out_stock.findMany({
      where: { month: InOutStockService.MONTH, year: InOutStockService.YEAR },
      select: {
        in_quantity: true,
        out_quantity: true,
        month: true,
        year: true,
      },
    });
  }

  /**
   * Incrementa a quantidade de entrada no mês atual.
   *
   * @param {number} quantity - Quantidade a ser atualizada
   * @see {MONTH}
   * @see {YEAR}
   * @returns {Promise<void>}
   */
  async incrementMonthlyInStockQuantity(quantity: number): Promise<void> {
    await this._prisma.in_out_stock.updateMany({
      where: { month: InOutStockService.MONTH, year: InOutStockService.YEAR },
      data: { in_quantity: { increment: quantity } },
    });

    io.emit("in-stock", quantity);
  }

  /**
   * Incrementa a quantidade de saída no mês atual.
   *
   * @param {number} quantity - Quantidade a ser atualizada
   * @see {MONTH}
   * @see {YEAR}
   * @returns {Promise<void>}
   */
  async incrementMonthlyOutStockQuantity(quantity: number): Promise<void> {
    await this._prisma.in_out_stock.updateMany({
      where: { month: InOutStockService.MONTH, year: InOutStockService.YEAR },
      data: { out_quantity: { increment: quantity } },
    });

    io.emit("out-stock", quantity);
  }
}

export default InOutStockService;
