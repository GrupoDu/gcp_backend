export interface IGoal {
  goal_uuid: string;
  created_at: Date;
  goal_title: string;
  goal_description: string | null;
  goal_type: string;
  goal_deadline: Date;
  employee_goal: string | null;
  goal_status: string;
}

/**
 * @extends {IGoal}
 * @see {IGoal}
 * @Omit goal_uuid
 */
export interface IGoalCreate extends Omit<IGoal, "goal_uuid" | "created_at"> {}

/**
 * @extends {IGoal}
 * @see {IGoal}
 * @Omit employee_goal
 */
export interface IEmployeeGoal extends Omit<IGoal, "employee_goal"> {
  employee_goal: string | null;
}

/**
 * @extends {IGoal}
 * @see {IGoal}
 * @omit goal_uuid
 */
export interface IGoalUpdate extends Partial<IGoalCreate> {}
