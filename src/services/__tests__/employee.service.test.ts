import { describe, it, beforeEach, vi, expect } from "vitest";
import type { IEmployee } from "../../types/employee.interface.js";
import { randomUUID } from "crypto";
import EmployeeService from "../employee.service.js";

vi.mock("../../../lib/prisma.js");
import prisma from "../../tests/__mocks__/@prisma/prisma.js";

describe("Testes de funcionário.", () => {
  let employeeService: EmployeeService;
  let employeeList: IEmployee[];

  beforeEach(() => {
    employeeList = [
      {
        employee_id: "550e8400-e29b-41d4-a716-446655440000",
        employee_role: "Funcionário",
        name: "Pablo",
      },
      {
        employee_id: randomUUID(),
        employee_role: "Funcionário",
        name: "Gabriel",
      },
    ];

    employeeService = new EmployeeService(prisma);
  });

  it("Deve registrar novo funcionário.", async () => {
    const fakeEmployee: IEmployee = {
      employee_id: randomUUID(),
      employee_role: "Funcionário",
      name: "Marcio",
    };

    prisma.employee.create.mockResolvedValue(fakeEmployee);

    const newEmployee = await employeeService.registerNewEmployee(fakeEmployee);

    expect(newEmployee.name).toBe("Marcio");
  });

  it("Deve conseguir remover funcionário.", async () => {
    prisma.employee.delete.mockResolvedValue(employeeList[0]!);

    const deletedEmployee = await employeeService.removeEmployeeData(
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(deletedEmployee).toBe("Funcionário removido do sistema.");
  });

  it("Deve conseguir editar funcionário.", async () => {
    prisma.employee.update.mockResolvedValue({
      employee_id: "550e8400-e29b-41d4-a716-446655440000",
      employee_role: "Funcionário",
      name: "Marcelo",
    });

    const updatedEmployee = await employeeService.updateEmployeeData(
      { name: "Marcelo" },
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(updatedEmployee.name).toBe("Marcelo");
  });
});
