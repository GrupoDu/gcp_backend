import { describe, it, beforeEach, vi, expect } from "vitest";
import type { IEmployee } from "../../types/employee.interface.js";
import { randomUUID } from "crypto";
import EmployeeService from "../employee.service.js";

vi.mock("../../../lib/prisma.js");
import prisma from "../../tests/__mocks__/@prisma/prisma.js";

describe("Testes de funcionário.", () => {
  let employeeService: EmployeeService;

  beforeEach(() => {
    employeeService = new EmployeeService(prisma);
  });

  it("Deve registrar novo funcionário.", async () => {
    const fakeEmployee: IEmployee = {
      employee_id: randomUUID(),
      employee_type: "Funcionário",
      name: "Marcio",
    };

    prisma.employee.create.mockResolvedValue(fakeEmployee);

    const newEmployee = await employeeService.registerNewEmployee(fakeEmployee);

    expect(newEmployee.name).toBe("Marcio");
  });

  it("Deve conseguir remover funcionário.", async ({ skip }) => {
    skip();
  });
});
