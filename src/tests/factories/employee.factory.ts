import { randomUUID } from "node:crypto";
import type { IEmployeeTestType } from "../../types/employee.interface.js";

export const employeeFactory = (
  overrides: Partial<IEmployeeTestType> = {},
): IEmployeeTestType => ({
  employee_id: randomUUID(),
  name: "Test Employee",
  employee_role: "assistant",
  delivered_activities_quantity: 10,
  not_delivered_activities_quantity: 5,
  produced_quantity: 100,
  ...overrides,
});
