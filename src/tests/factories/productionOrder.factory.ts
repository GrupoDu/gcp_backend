import { randomUUID } from "node:crypto";
import type { IProductionOrderTestType } from "../../types/productionOrder.interface.js";

export const productionOrderFactory = (
  overrides = {},
): IProductionOrderTestType => ({
  production_order_id: randomUUID(),
  created_at: new Date(),
  production_order_title: "Título do registro",
  production_order_deadline: new Date(2025, 3, 5),
  production_order_description: "",
  production_order_status: "Pendente",
  supervisor_uuid: randomUUID(),
  product_quantity: 0,
  employee_uuid: randomUUID(),
  cut_assistant: randomUUID(),
  delivery_observation: null,
  delivered_at: null,
  finishing_assistant: null,
  fold_assistant: null,
  paint_assistant: null,
  delivered_product_quantity: 0,

  ...overrides,
});
