import type { PrismaClient } from "../../generated/prisma/client.ts";
import type { IGoal } from "../types/goal.interface.ts";
import { getTodayDate } from "../utils/getTodayDate.ts";

class GoalsAnalysisService {
  private prisma: PrismaClient;  

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getGoalsAnalysis() {
    const allGoals: IGoal[] = await this.prisma.goals.findMany({
      where: {
        goal_deadline: {
          gte: new Date(
            getTodayDate().getFullYear(),
            getTodayDate().getMonth(),
            1,
          ),
          lt: new Date(
            getTodayDate().getFullYear(),
            getTodayDate().getMonth() + 1,
            1,
          ),
        },
      },
    });

    if (!allGoals) throw new Error("Nenhuma meta encontrada.");

    const allPendingGoals: IGoal[] = allGoals.filter(
      (goal) => goal.goal_status === "Pendente",
    );

    const allBeatenGoals: IGoal[] = allGoals.filter(
      (goal) => goal.goal_status === "Batida",
    );

    return { allPendingGoals, allBeatenGoals };
  }
}

export default GoalsAnalysisService;
