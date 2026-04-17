import * as z from "zod";

export const ProductSchema = z.object({
  product_uuid: z.string(),
  name: z.string(),
  description: z.string(),
  product_type: z.string(),
  created_at: z.date().optional(),
  image: z.string(),
  features: z.array(z.string()).optional(),
  acronym: z.string().optional(),
  composition: z.json().optional(),
  stock_quantity: z.number().optional(),
});

export const ProductCreateSchema = ProductSchema.omit({
  product_uuid: true,
  created_at: true,
  composition: true,
});

export const ProductUpdateSchema = ProductSchema.omit({
  product_uuid: true,
  created_at: true,
  composition: true,
}).partial();
