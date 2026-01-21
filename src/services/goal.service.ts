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

  async getAllGoalsData(): Promise<IGoal[]> {
    const allGoalsData: IGoal[] = await this.prisma.goal.findMany();

    if (!allGoalsData) {
      throw new Error("Nenhuma meta encontrada.");
    }

    return allGoalsData;
  }

  async createNewGoal(newGoalData: IGoal): Promise<IGoal> {
    if (!newGoalData) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    if (newGoalData.goal_type === "Funcionário") {
      const newEmployeeGoal: IGoal = await this.createEmployeeGoal(newGoalData);

      return newEmployeeGoal;
    }

    const newGoal: IGoal = await this.prisma.goal.create({
      data: newGoalData,
    });

    return newGoal;
  }

  async createEmployeeGoal(newGoalData: IGoal): Promise<IGoal> {
    if (newGoalData.goal_type !== "Funcionário") {
      throw new Error("Tipo de meta inválido.");
    }

    const newEmployeeGoal: IEmployeeGoal = await this.prisma.goal.create({
      data: newGoalData,
    });

    return newEmployeeGoal as IGoal;
  }

  async deleteGoal(goalUuid: string): Promise<string> {
    if (!goalUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    await this.prisma.goal.delete({
      where: {
        goal_id: goalUuid,
      },
    });

    return "Meta excluida com sucesso.";
  }

  async updateGoalData(
    goalData: IGoalUpdate,
    goalUuid: string,
  ): Promise<IGoal> {
    if (!goalUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updateFields = removeUndefinedUpdateFields(goalData);

    if (updateFields.length < 1) throw new Error("Nenhum campo fornecido");

    const updatedGoal: IGoal = await this.prisma.goal.update({
      where: {
        goal_id: goalUuid as string,
      },
      data: updateFields,
    });

    return updatedGoal;
  }
}

export default GoalService;
