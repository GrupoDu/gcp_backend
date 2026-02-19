import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IAnualAnalysis } from "../types/anualAnalysis.interface.js";

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
}

export default AnualAnalysisService;
