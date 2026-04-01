export interface IGoal {
  goal_id: string;
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
 * @Omit goal_id
 */
export interface IGoalCreate extends Omit<IGoal, "goal_id"> {}

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
 * @omit goal_id
 */
export interface IGoalUpdate extends Partial<Omit<IGoal, "goal_id">> {}
