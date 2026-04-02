import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IAnualAnalysis } from "../types/anualAnalysis.interface.js";

/**
 * Service responsável por gerenciar análises anuais.
 *
 * @class {AnualAnalysisService}
 * @see {AnualAnalysisController}
 */
class AnualAnalysisService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Método responsável por buscar análises mensais.
   *
   * @returns {Promise<IAnualAnalysis[]>} Array de análises mensais
   */
  async getMontlyAnalysis(): Promise<IAnualAnalysis[]> {
    return this._prisma.anualAnalysis.findMany();
  }

  /**
   * Método responsável por atualizar o número de ordens entregues.
   *
   * @returns {Promise<string>} Mensagem de sucesso
   */
  async updateDeliveredMontlyAnalysis(): Promise<string> {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    const updatedAnalysis = await this._prisma.anualAnalysis.updateMany({
      where: {
        month: MONTH,
        year: YEAR,
      },
      data: {
        delivered: { increment: 1 },
      },
    });

    if (updatedAnalysis.count < 1)
      throw new Error("Nenhuma analise encontrada.");

    return "Analise mensal atualizada com sucesso.";
  }
}

export default AnualAnalysisService;
