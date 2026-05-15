import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IAnnualAnalysis } from "../types/annualAnalysis.interface.js";

/**
 * Service responsável por gerenciar análises anuais.
 */
class AnnualAnalysisService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Método responsável por buscar análises mensais.
   */
  async getMontlyAnalysis(): Promise<IAnnualAnalysis[]> {
    return this._prisma.annual_analysis.findMany() as unknown as Promise<
      IAnnualAnalysis[]
    >;
  }

  /**
   * Método responsável por atualizar o número de ordens entregues.
   */
  async updateDeliveredMontlyAnalysis(): Promise<string> {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    await this._prisma.annual_analysis.updateMany({
      where: {
        month: MONTH,
        year: YEAR,
      },
      data: {
        delivered: { increment: 1 },
      },
    });

    return "Analise mensal atualizada com sucesso.";
  }

  async updateMontlyTotalProduction(quantity: number): Promise<string> {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    await this._prisma.annual_analysis.updateMany({
      where: {
        month: MONTH,
        year: YEAR,
      },
      data: {
        total_production: { increment: quantity },
      },
    });

    return "Analise mensal atualizada com sucesso.";
  }
}

export default AnnualAnalysisService;
