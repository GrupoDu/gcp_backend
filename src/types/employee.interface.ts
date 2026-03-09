import type { Decimal } from "@prisma/client/runtime/wasm-compiler-edge";

export interface IEmployee {
  employee_id: string;
  name: string;
  employee_type: string;
  delivered_activities_quantity: Decimal;
  not_delivered_activities_quantity: Decimal;
  produced_quantity: Decimal;
}

export interface IEmployeeCreate extends Omit<IEmployee, "employee_id"> {}

export interface IEmployeeUpdate extends Partial<
  Omit<IEmployee, "employee_id">
> {}
