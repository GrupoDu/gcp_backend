import * as z from "zod";

/**
 * Schema de validação para a ordem de produção.
 * @see IProductionOrder
 */
const ProductionOrderSchema = z.object({
  production_order_description: z.string().optional(),
  production_order_title: z.string(),
  production_order_status: z.string(),
  production_order_id: z.uuid(),
  production_order_deadline: z.date(),
  delivery_observation: z.string().optional(),
  supervisor_uuid: z.uuid().optional(),
  created_at: z.date(),
  delivered_at: z.date().optional(),
  delivered_product_quantity: z.number(),
  employee_uuid: z.uuid().optional(),
  finishing_assistant: z.uuid().optional(),
  cut_assistant: z.uuid().optional(),
  fold_assistant: z.uuid().optional(),
  paint_assistant: z.uuid().optional(),
  stock_validation: z.boolean(),
});

/**
 * Schema de validação para criação de ordem de produção.
 * @see IProductionOrder
 * @see ProductionOrderSchema
 */
export const CreateProductionOrderSchema = ProductionOrderSchema.omit({
  production_order_id: true,
  created_at: true,
  delivered_at: true,
  employee_uuid: true,
  delivery_observation: true,
  production_order_description: true,
  delivered_product_quantity: true,
  stock_validation: true,
  supervisor_uuid: true,
});

export const UpdateProductionOrderSchema = ProductionOrderSchema.partial();
