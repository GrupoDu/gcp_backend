export interface IEmployee {
  employee_uuid: string;
  name: string;
  employee_role: string;
  delivered_activities_quantity: number;
  not_delivered_activities_quantity: number;
  produced_quantity: number;
}

/**
 * @extends {IEmployee}
 * @see {IEmployee}
 * @Omit employee_id
 */
export interface IEmployeeCreate extends Omit<IEmployee, "employee_uuid"> {}

/**
 * @extends {IEmployee}
 * @see {IEmployee}
 * @Omit employee_id
 */
export interface IEmployeeUpdate extends Partial<
  Omit<IEmployee, "employee_uuid">
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
