export interface IEmployee {
  employee_id: string;
  name: string;
  employee_type: string;
}

export interface IEmployeeCreate extends Omit<IEmployee, "employee_id"> {}

export interface IEmployeeUpdate extends Partial<
  Omit<IEmployee, "employee_id">
> {}
