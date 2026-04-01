import * as z from "zod";

/**
 * Schema de validação para a meta.
 * @see IGoal
 */
const GoalSchema = z.object({
  goal_id: z.string(),
  goal_title: z.string(),
  goal_description: z.string().optional(),
  goal_type: z.string(),
  goal_deadline: z.date(),
  employee_goal: z.string().optional(),
  goal_status: z.string().optional(),
});

/**
 * Schema de validação para atualização de meta.
 * @see IGoalUpdate
 * @see GoalSchema
 */
export const GoalUpdateSchema = GoalSchema.partial().omit({ goal_id: true });

/**
 * Schema de validação para criação de meta.
 * @see IGoalCreate
 * @see GoalSchema
 */
export const GoalCreateSchema = GoalSchema.omit({ goal_id: true });
