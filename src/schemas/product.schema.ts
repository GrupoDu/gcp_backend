import * as z from "zod";

export const ProductSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string(),
  product_type: z.string(),
  created_at: z.date(),
  image: z.string(),
  features: z.string().optional(),
  acronym: z.string().optional(),
  composition: z.json().optional(),
  stock_quantity: z.number().optional(),
});

export const ProductCreateSchema = ProductSchema.omit({
  uuid: true,
  created_at: true,
  composition: true,
});

export const ProductUpdateSchema = ProductSchema.partial({
  uuid: true,
  created_at: true,
  composition: true,
});
