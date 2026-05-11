import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IGoal,
  IGoalCreate,
  IGoalUpdate,
  IEmployeeGoal,
} from "../types/goal.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import { isValidDate } from "../utils/isValidDate.js";

/**
 * Service responsável por gerenciar metas.
 */
class GoalService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todas as metas.
   */
  async getAllGoalsData(): Promise<IGoal[]> {
    return this._prisma.goals.findMany();
  }

  /**
   * Cria uma meta.
   */
  async createNewGoal(newGoalData: IGoalCreate): Promise<IGoal> {
    isValidDate(newGoalData.goal_deadline.toString());

    const isEmployeeGoal = newGoalData.goal_type === "Funcionário";
    if (isEmployeeGoal) return this.createEmployeeGoal(newGoalData);

    return this._prisma.goals.create({
      data: newGoalData,
    });
  }

  /**
   * Cria uma meta para o funcionário
   */
  private async createEmployeeGoal(
    newGoalData: IGoalCreate,
  ): Promise<IEmployeeGoal> {
    if (newGoalData.goal_type !== "Funcionário")
      throw new Error("Tipo de meta inválido.");

    return this._prisma.goals.create({
      data: newGoalData,
    });
  }

  /**
   * Remove uma meta
   */
  async deleteGoal(goalUuid: string): Promise<string> {
    if (!goalUuid) throw new Error(responseMessages.fillAllFieldMessage);

    const deletedGoal = await this._prisma.goals.delete({
      where: {
        goal_uuid: goalUuid,
      },
    });

    if (!deletedGoal) throw new Error("Meta não encontrada.");

    return "Meta excluida com sucesso.";
  }

  /**
   * Atualiza uma meta
   */
  async updateGoalData(
    goalData: IGoalUpdate,
    goalUuid: string,
  ): Promise<IGoal> {
    if (!goalUuid) throw new Error(responseMessages.fillAllFieldMessage);

    const updateFields = removeUndefinedUpdateFields(goalData);
    const hasUpdateFields = Object.keys(updateFields).length > 0;

    if (!hasUpdateFields) throw new Error("Nenhum campo fornecido");

    return this._prisma.goals.update({
      where: {
        goal_uuid: goalUuid,
      },
      data: updateFields,
    });
  }
}

export default GoalService;
