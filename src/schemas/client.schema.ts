import * as z from "zod";

export const ClientSchema = z.object({
  client_name: z.string().min(1, "O nome do cliente é obrigatório"),
  client_cnpj: z.string(),
  client_address: z.string(),
  client_phone: z.string(),
  client_landline: z.string().optional(),
});

export const ClientUpdateSchema = ClientSchema.partial();
