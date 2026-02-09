import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IAnualAnalysis } from "../types/anualAnalysis.interface.js";

class AnualAnalysisService {
  constructor(private prisma: PrismaClient) {}

  async getMontlyAnalysis() {
    const montlyAnalysisDate: IAnualAnalysis[] =
      await this.prisma.anualAnalysis.findMany();

    return montlyAnalysisDate;
  }
}

export default AnualAnalysisService;
