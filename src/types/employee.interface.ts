import type { Decimal } from "@prisma/client/runtime/wasm-compiler-edge";

export interface IEmployee {
  employee_id: string;
  name: string;
  employee_type: string;
  delivered_activities_quantity: Decimal;
  not_delivered_activities_quantity: Decimal;
  produced_quantity: Decimal;
}

/**
 * @extends {IEmployee}
 * @see {IEmployee}
 * @Omit employee_id
 */
export interface IEmployeeCreate extends Omit<IEmployee, "employee_id"> {}

/**
 * @extends {IEmployee}
 * @see {IEmployee}
 * @Omit employee_id
 */
export interface IEmployeeUpdate extends Partial<
  Omit<IEmployee, "employee_id">
> {}

/**
 * @extends {IEmployee}
 * @see {IEmployee}
 * @Omit delivered_activities_quantity, not_delivered_activities_quantity, produced_quantity
 */
export interface IEmployeeTestType extends Omit<
  IEmployee,
  | "delivered_activities_quantity"
  | "not_delivered_activities_quantity"
  | "produced_quantity"
> {
  delivered_activities_quantity: number;
  not_delivered_activities_quantity: number;
  produced_quantity: number;
}
