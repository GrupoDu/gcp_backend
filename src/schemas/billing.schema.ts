import * as z from "zod";

export const BillingSchema = z.object({
  billing_address: z.string(),
  name: z.string().optional(),
  client_uuid: z.string().uuid(),
});

export const BillingUpdateSchema = BillingSchema.partial();
