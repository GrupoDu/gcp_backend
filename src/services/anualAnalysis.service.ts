import type { PrismaClient } from "../../generated/prisma/client.ts";
import type { IAnualAnalysis } from "../types/anualAnalysis.interface.ts";

class AnualAnalysisService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getMontlyAnalysis() {
    const montlyAnalysisDate: IAnualAnalysis[] =
      await this.prisma.anualAnalysis.findMany();

    return montlyAnalysisDate;
  }

  async updateDeliveredMontlyAnalysis() {
    const MONTH = new Date().getMonth() + 1;
    const YEAR = new Date().getFullYear();

    const updatedAnalysis = await this.prisma.anualAnalysis.updateMany({
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
