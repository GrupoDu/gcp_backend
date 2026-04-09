import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IEmployeeGoal,
  IGoal,
  IGoalCreate,
  IGoalUpdate,
} from "../types/goal.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import { isValidDate } from "../utils/isValidDate.js";

/**
 * Service responsável por gerenciar metas.
 *
 * @class GoalService
 * @see GoalController
 */
class GoalService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todas as metas.
   *
   * @returns {Promise<IGoal[]>} - Lista de metas
   * @see {IGoal}
   */
  async getAllGoalsData(): Promise<IGoal[]> {
    return this._prisma.goals.findMany();
  }

  /**
   * Cria uma meta.
   *
   * @param {IGoalCreate} newGoalData - Dados da nova meta
   * @returns {Promise<IGoal>} - Meta criada
   * @see {createEmployeeGoal}
   * @see {isValidDate}
   * @see {IGoalCreate}
   * @see {IGoal}
   */
  async createNewGoal(newGoalData: IGoalCreate): Promise<IGoal> {
    isValidDate(newGoalData.goal_deadline.toString());

    const isEmployeeGoal = newGoalData.goal_type === "Funcionário";
    if (isEmployeeGoal) {
      return this.createEmployeeGoal(newGoalData);
    }

    return this._prisma.goals.create({
      data: newGoalData,
    });
  }

  /**
   * Cria uma meta para o funcionário
   *
   * @param {IGoalCreate} newGoalData - Dados da nova meta
   * @returns {Promise<IEmployeeGoal>} - Meta criada
   * @see {IGoalCreate}
   * @see {IEmployeeGoal}
   * @private
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
   *
   * @param {string} goalUuid - ID da meta
   * @returns {Promise<string>} - Mensagem de meta deletada com sucesso
   */
  async deleteGoal(goalUuid: string): Promise<string> {
    if (!goalUuid) throw new Error(responseMessages.fillAllFieldMessage);

    const deletedGoal = await this._prisma.goals.delete({
      where: {
        goal_id: goalUuid,
      },
    });

    if (!deletedGoal) throw new Error("Meta não encontrada.");

    return "Meta excluida com sucesso.";
  }

  /**
   * Atualiza uma meta
   *
   * @param {IGoalUpdate} goalData - Dados atualizados da meta
   * @param {string} goalUuid - ID da meta
   * @returns {Promise<IGoal>} - Meta atualizada
   * @see {IGoalUpdate}
   * @see {IGoal}
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
        goal_id: goalUuid,
      },
      data: updateFields,
    });
  }
}

export default GoalService;
