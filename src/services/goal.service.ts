import type { PrismaClient } from "@prisma/client";
import type {
  IEmployeeGoal,
  IGoal,
  IGoalUpdate,
} from "../types/goal.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

class GoalService {
  constructor(private prisma: PrismaClient) {}

  async getAllGoalsData() {
    const allGoalsData = await this.prisma.goal.findMany();

    if (!allGoalsData) {
      throw new Error("Nenhuma meta encontrada.");
    }

    return allGoalsData;
  }

  async createNewGoal(newGoalData: IGoal) {
    if (!newGoalData) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    if (newGoalData.goal_type === "Funcionário") {
      const newEmployeeGoal = await this.createEmployeeGoal(newGoalData);

      return newEmployeeGoal;
    }

    const newGoal = await this.prisma.goal.create({
      data: newGoalData,
    });

    return newGoal;
  }

  private async createEmployeeGoal(newGoalData: IGoal) {
    if (newGoalData.goal_type !== "Funcionário") {
      throw new Error("Tipo de meta inválido.");
    }

    const newEmployeeGoal = await this.prisma.goal.create({
      data: newGoalData,
    });

    return newEmployeeGoal;
  }

  async deleteGoal(goalUuid: string): Promise<string> {
    if (!goalUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const deletedGoal = await this.prisma.goal.delete({
      where: {
        goal_id: goalUuid,
      },
    });

    if (!deletedGoal) throw new Error("Meta não encontrada.");

    return "Meta excluida com sucesso.";
  }

  async updateGoalData(goalData: IGoalUpdate, goalUuid: string) {
    if (!goalUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updateFields = removeUndefinedUpdateFields(goalData);

    if (Object.keys(updateFields).length < 1)
      throw new Error("Nenhum campo fornecido");

    const updatedGoal = await this.prisma.goal.update({
      where: {
        goal_id: goalUuid as string,
      },
      data: updateFields,
    });

    return updatedGoal;
  }
}

export default GoalService;
