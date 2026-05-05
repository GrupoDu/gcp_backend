import * as z from "zod";

export const DeliveriesSchema = z.object({
  order_uuid: z.string().uuid(),
  delivery_address: z.string(),
  building: z.string(),
  reference: z.string().optional(),
  delivery_observation: z.string().optional(),
});

export const DeliveriesUpdateSchema = DeliveriesSchema.partial();
