import type { Decimal } from "../../generated/prisma/internal/prismaNamespace.js";

export interface IEmployee {
  employee_id: string;
  name: string;
  employee_type: string;
  delivered_activities_quantity: Decimal;
  not_delivered_activities_quantity: Decimal;
}

export interface IEmployeeCreate extends Omit<IEmployee, "employee_id"> {}

export interface IEmployeeUpdate extends Partial<
  Omit<IEmployee, "employee_id">
> {}
