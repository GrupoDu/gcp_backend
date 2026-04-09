import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IGoal } from "../types/goal.interface.js";
import { getTodayDate } from "../utils/getTodayDate.js";

/**
 * Service responsável por gerenciar análises de metas.
 *
 * @class GoalsAnalysisService
 * @see GoalsAnalysisController
 */
class GoalsAnalysisService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Calcula o número de metas batidas e pendentes.
   *
   * @returns {Promise<{ goalsAchieved: number; goalsNotAchieved: number }>} - Número de metas batidas e pendentes
   */
  async getGoalsAnalysis(): Promise<{
    goalsAchieved: number;
    goalsNotAchieved: number;
  }> {
    const allGoals: IGoal[] = await this._prisma.goals.findMany({
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

    const goalsAchieved: number = this.getBeatedGoals(allGoals);

    const goalsNotAchieved: number = this.getPendingGoals(allGoals);

    return { goalsAchieved, goalsNotAchieved };
  }

  /**
   * Calcula a quantidade de metas batidas.
   *
   * @param {IGoal[]} goals - Todas metas
   * @returns {number} - Número de metas batidas
   * @private
   */
  private getBeatedGoals(goals: IGoal[]): number {
    return goals.filter((goal) => goal.goal_status === "Batida").length;
  }

  /**
   * Calcula a quantidade de metas pendentes
   *
   * @param {IGoal[]} goals - Todas as métas
   * @returns {number} - Número de metas pendentes
   * @private
   */
  private getPendingGoals(goals: IGoal[]): number {
    return goals.filter((goal) => goal.goal_status === "Pendente").length;
  }
}

export default GoalsAnalysisService;
