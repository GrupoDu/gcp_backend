import * as z from "zod";

export const ProductSchema = z.object({
  product_uuid: z.string(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  product_type: z.string().nonempty(),
  image: z.string(),
  unit_price: z.number(),
  features: z.array(z.string()).optional(),
  created_at: z.date().optional(),
  acronym: z.string().optional(),
  composition: z.any().optional(),
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
