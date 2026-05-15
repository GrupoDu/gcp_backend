import * as z from "zod";

/**
 * Schema de validação para a ordem de produção.
 * @see IProductionOrder
 */
const ProductionOrderSchema = z.object({
  production_order_uuid: z.string().uuid().optional(),
  production_order_description: z.string().optional(),
  production_order_status: z.string(),
  production_order_deadline: z.date(),
  quantity_to_produce: z.number().int().nonnegative(),
  produced_quantity: z.number().int().nonnegative(),
  delivery_observation: z.string().optional().nullable(),
  supervisor_uuid: z.string().uuid().optional().nullable(),
  created_at: z.date(),
  delivered_at: z.date().optional().nullable(),
  delivered_product_quantity: z.number().int().nonnegative(),
  welder_uuid: z.string().uuid().optional().nullable(),
  product_uuid: z.string().uuid(),
  order_uuid: z.string().uuid(),
  stock_validation: z.boolean().optional(),
});

/**
 * Schema de validação para criação de ordem de produção.
 */
export const CreateProductionOrderSchema = ProductionOrderSchema.omit({
  production_order_uuid: true,
  delivered_at: true,
  created_at: true,
  stock_validation: true,
  delivered_product_quantity: true,
  produced_quantity: true,
  delivery_observation: true,
});

export const UpdateProductionOrderSchema = ProductionOrderSchema.partial();
