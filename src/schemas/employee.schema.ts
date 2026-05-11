import * as z from "zod";

export const EmployeeSchema = z.object({
  employee_uuid: z.string().uuid(),
  name: z.string(),
  employee_role: z.string(),
  delivered_activities_quantity: z.number().int().nonnegative(),
  not_delivered_activities_quantity: z.number().int().nonnegative(),
  produced_quantity: z.number().int().nonnegative(),
});

export const EmployeeCreateSchema = EmployeeSchema.omit({
  employee_uuid: true,
  delivered_activities_quantity: true,
  not_delivered_activities_quantity: true,
  produced_quantity: true,
});

export const EmployeeUpdateSchema = EmployeeSchema.omit({
  employee_uuid: true,
}).partial();
