import * as z from "zod";

/**
 * Schema de validação para a ordem de produção.
 * @see IProductionOrder
 */
const ProductionOrderSchema = z.object({
  production_order_description: z.string().optional(),
  production_order_title: z.string(),
  production_order_status: z.string(),
  production_order_uuid: z.uuid().optional(),
  production_order_deadline: z.date(),
  product_quantity: z.number(),
  delivery_observation: z.string().optional(),
  supervisor_uuid: z.uuid().optional(),
  created_at: z.date(),
  delivered_at: z.date().optional(),
  delivered_product_quantity: z.number(),
  employee_uuid: z.uuid().optional(),
  finishing_assistant: z.uuid().optional(),
  cut_assistant: z.uuid().optional(),
  fold_assistant: z.uuid().optional(),
  product_uuid: z.uuid(),
  paint_assistant: z.uuid().optional(),
  stock_validation: z.boolean().optional(),
});

/**
 * Schema de validação para criação de ordem de produção.
 * @see IProductionOrder
 * @see ProductionOrderSchema
 */
export const CreateProductionOrderSchema = ProductionOrderSchema.omit({
  delivered_at: true,
  created_at: true,
  delivery_observation: true,
  stock_validation: true,
  delivered_product_quantity: true,
});

export const UpdateProductionOrderSchema = ProductionOrderSchema.partial();
