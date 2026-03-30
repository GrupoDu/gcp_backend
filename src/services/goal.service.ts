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
 * @see GoalController
 * @method getAllGoalsData
 * @method createNewGoal
 * @method deleteGoal
 * @method updateGoalData
 */
class GoalService {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async getAllGoalsData() {
    const allGoalsData: IGoal[] = await this._prisma.goals.findMany();

    if (!allGoalsData) throw new Error("Nenhuma meta encontrada.");

    return allGoalsData;
  }

  async createNewGoal(newGoalData: IGoalCreate) {
    if (!newGoalData) throw new Error(responseMessages.fillAllFieldMessage);

    isValidDate(newGoalData.goal_deadline.toString());

    const isEmployeeGoal = newGoalData.goal_type === "Funcionário";
    if (isEmployeeGoal) {
      return this.createEmployeeGoal(newGoalData);
    }

    const newGoal = await this._prisma.goals.create({
      data: newGoalData,
    });

    return newGoal;
  }

  private async createEmployeeGoal(newGoalData: IGoalCreate) {
    if (newGoalData.goal_type !== "Funcionário")
      throw new Error("Tipo de meta inválido.");

    const newEmployeeGoal: IEmployeeGoal = await this._prisma.goals.create({
      data: newGoalData,
    });

    return newEmployeeGoal;
  }

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

  async updateGoalData(goalData: IGoalUpdate, goalUuid: string) {
    if (!goalUuid) throw new Error(responseMessages.fillAllFieldMessage);

    const updateFields = removeUndefinedUpdateFields(goalData);
    const hasUpdateFields = Object.keys(updateFields).length > 0;

    if (!hasUpdateFields) throw new Error("Nenhum campo fornecido");

    const updatedGoal = await this._prisma.goals.update({
      where: {
        goal_id: goalUuid,
      },
      data: updateFields,
    });

    return updatedGoal;
  }
}

export default GoalService;
