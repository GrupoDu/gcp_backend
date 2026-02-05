export interface IGoal {
  goal_id: string;
  title: string;
  description: string | null;
  goal_type: string;
  deadline: Date;
  employee_goal?: string | null;
  goal_status: boolean;
}

export interface IEmployeeGoal extends Omit<IGoal, "employee_goal"> {
  employee_goal: string | null;
}

export interface IGoalUpdate extends Partial<Omit<IGoal, "goal_id">> {}
