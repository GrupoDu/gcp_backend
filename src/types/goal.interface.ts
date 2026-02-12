export interface IGoal {
  goal_id: string;
  goal_title: string;
  goal_description: string | null;
  goal_type: string;
  goal_deadline: Date;
  employee_goal: string | null;
  goal_status: string;
}

export interface IEmployeeGoal extends Omit<IGoal, "employee_goal"> {
  employee_goal: string | null;
}

export interface IGoalUpdate extends Partial<Omit<IGoal, "goal_id">> {}
