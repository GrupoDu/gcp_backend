import * as z from "zod";

/**
 * Schema de validação para a meta.
 * @see IGoal
 */
const GoalSchema = z.object({
  goal_uuid: z.string().uuid(),
  goal_title: z.string(),
  goal_description: z.string().optional().nullable(),
  goal_type: z.string(),
  goal_deadline: z.date(),
  employee_goal: z.string().uuid().optional().nullable(),
  goal_status: z.string(),
});

/**
 * Schema de validação para atualização de meta.
 * @see IGoalUpdate
 */
export const GoalUpdateSchema = GoalSchema.partial().omit({ goal_uuid: true });

/**
 * Schema de validação para criação de meta.
 * @see IGoalCreate
 */
export const GoalCreateSchema = GoalSchema.omit({ goal_uuid: true });
