import { describe, it, beforeEach, vi, expect } from "vitest";
import GoalService from "../goal.service.js";

vi.mock("../../../lib/prisma.js");
import prisma from "../../tests/__mocks__/@prisma/prisma.js";
import { randomUUID } from "node:crypto";

describe("Testes de criação de meta.", () => {
  let goalService: GoalService;
  let newMockedGoal: any;

  beforeEach(() => {
    newMockedGoal = {
      deadline: new Date(),
      description: "Descrição de uma meta ficticia para testes",
      goal_id: randomUUID(),
      goal_type: "Funcionário",
      title: "Nome de meta ficticia",
      created_at: new Date(),
      employee_goal: randomUUID(),
    };

    goalService = new GoalService(prisma);
  });

  it("Deve criar uma nova meta para usuário.", async () => {
    prisma.goals.create.mockResolvedValue(newMockedGoal);

    const newGoal = await goalService.createNewGoal(newMockedGoal);

    expect(newGoal.title).toBe("Nome de meta ficticia");
  });

  it("Deve criar uma meta geral.", async () => {
    newMockedGoal.goal_type = "Geral";
    prisma.goal.create.mockResolvedValue(newMockedGoal);

    const newGeneralGoal = await goalService.createNewGoal(newMockedGoal);

    expect(newGeneralGoal.goal_type).toBe("Geral");
  });
});

describe("Testes de update de meta.", () => {
  let goalService: GoalService;

  beforeEach(() => {
    goalService = new GoalService(prisma);
  });

  it("Deve atualizar uma meta.", async () => {
    const updatedMockGoal = {
      title: "Nome de meta ficticia",
      deadline: new Date(),
      description: "Descrição de meta atualizada.",
      goal_id: "550e8400-e29b-41d4-a716-446655440000",
      goal_type: "Funcionário",
      created_at: new Date(),
      employee_goal: randomUUID(),
    };

    prisma.goal.update.mockResolvedValue(updatedMockGoal);

    const updatedGoal = await goalService.updateGoalData(
      { description: "Descrição de meta atualizada." },
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(updatedGoal.description).toBe("Descrição de meta atualizada.");
  });

  it("Deve dar erro de sem campos a serem atualizados.", async () => {
    await expect(
      goalService.updateGoalData({}, "550e8400-e29b-41d4-a716-446655440000"),
    ).rejects.toThrowError();
  });
});

describe("Testes de remover meta.", () => {
  let goalService: GoalService;

  beforeEach(() => {
    goalService = new GoalService(prisma);
  });

  it("Deve retornar erro de meta não encontrada.", async () => {
    await expect(goalService.deleteGoal("a")).rejects.toThrowError();
  });
});
