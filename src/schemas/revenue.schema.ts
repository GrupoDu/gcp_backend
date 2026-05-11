import * as z from "zod";

export const RevenueSchema = z.object({
  revenue_address: z.string(),
  revenue_cnpj: z.string(),
  revenue_landline: z.string(),
  revenue_phone: z.string(),
  revenue_email: z.string().email(),
  client_uuid: z.string().uuid(),
});

export const RevenueUpdateSchema = RevenueSchema.partial();
