import * as z from "zod";

export const WeldersActivitiesSchema = z.object({
  welder_activity_uuid: z.uuid(),
  registered_at: z.date(),
  produced_quantity: z.number().nonnegative().default(0),
  welder_uuid: z.uuid(),
  product_uuid: z.uuid(),
});

export const CreateWelderActivitySchema = WeldersActivitiesSchema.omit({
  welder_activity_uuid: true,
});
