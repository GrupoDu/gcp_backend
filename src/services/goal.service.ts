import type { PrismaClient } from "@prisma/client";
import type {
  IEmployeeGoal,
  IGoal,
  IGoalResponse,
} from "../types/goal.interface.js";
import { responseMessages } from "../constants/messages.constants.js";

class GoalService {
  constructor(private prisma: PrismaClient) {}

  async getAllGoalsData(): Promise<IGoalResponse[]> {
    const allGoalsData: IGoalResponse[] = await this.prisma.goal.findMany();

    if (!allGoalsData) {
      throw new Error("Nenhuma meta encontrada.");
    }

    return allGoalsData;
  }

  async createNewGoal(newGoalData: IGoal): Promise<IGoalResponse> {
    if (!newGoalData) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    if (newGoalData.goal_type === "Funcionário") {
      const newEmployeeGoal: IGoalResponse =
        await this.createEmployeeGoal(newGoalData);

      return newEmployeeGoal;
    }

    const newGoal: IGoalResponse = await this.prisma.goal.create({
      data: newGoalData,
    });

    return newGoal;
  }

  async createEmployeeGoal(newGoalData: IGoal): Promise<IGoalResponse> {
    if (newGoalData.goal_type !== "Funcionário") {
      throw new Error("Tipo de meta inválido.");
    }

    const newEmployeeGoal: IEmployeeGoal = await this.prisma.goal.create({
      data: newGoalData,
    });

    return newEmployeeGoal as IGoalResponse;
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

  async updateGoal(goalData: IGoal, goalUuid: string): Promise<IGoalResponse> {
    if (!goalData || !goalUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updatedGoal: IGoalResponse = await this.prisma.goal.update({
      where: {
        goal_id: goalUuid as string,
      },
      data: goalData,
    });

    return updatedGoal;
  }
}

export default GoalService;
