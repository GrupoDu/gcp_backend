import * as z from "zod";

export const EmployeeSchema = z.object({
  employee_uuid: z.string(),
  name: z.string(),
  employee_role: z.string(),
});

export const EmployeeCreateSchema = EmployeeSchema.omit({
  employee_uuid: true,
});

export const EmployeeUpdateSchema = EmployeeSchema.omit({
  employee_uuid: true,
}).partial();
