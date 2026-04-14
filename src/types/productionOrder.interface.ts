import type { Decimal } from "@prisma/client/runtime/wasm-compiler-edge";

export interface IProductionOrder {
  production_order_id: string;
  production_order_title: string;
  production_order_description?: string | null;
  delivery_observation?: string | null;
  created_at: Date;
  production_order_deadline: Date;
  production_order_status: string;
  product_quantity: Decimal;
  delivered_at?: Date | null;
  cut_assistant?: string | null;
  fold_assistant?: string | null;
  finishing_assistant?: string | null;
  paint_assistant?: string | null;
  employee_uuid?: string | null;
  supervisor_uuid: string | null;
  delivered_product_quantity?: Decimal;
  stock_validation?: boolean;
  order_id?: string | null;
}

/**
 * Campos omitidos na criação de ordem de produção
 * @see {IProductionOrder}
 */
type createOmitFields =
  | "production_order_id"
  | "created_at"
  | "delivered_product_quantity"
  | "stock_validation"
  | "delivered_at"
  | "employee_uuid"
  | "finishing_assistant"
  | "paint_assistant"
  | "fold_assistant"
  | "cut_assistant";

/**
 * @see {IProductionOrder}
 * @extends {IProductionOrder}
 * @Omit production_order_id, created_at, delivered_product_quantity, stock_validation, delivered_at, employee_uuid, finishing_assistant, paint_assistant, fold_assistant, cut_assistant
 */
export interface IProductionOrderCreate extends Omit<
  IProductionOrder,
  createOmitFields
> {}

/**
 * @see {IProductionOrder}
 * @extends {IProductionOrder}
 * @Omit production_order_id
 */
export interface IProductionOrderUpdate extends Partial<
  Omit<IProductionOrder, "production_order_id">
> {}

/**
 * @see {IProductionOrder}
 * @extends {IProductionOrder}
 * @Pick production_order_id, delivered_product_quantity, product_quantity
 */
export interface IProductionOrderDeliver extends Pick<
  IProductionOrder,
  "production_order_id" & "delivered_product_quantity" & "product_quantity"
> {}

/**
 * @see {IProductionOrder}
 * @extends {IProductionOrder}
 * @Omit delivered_product_quantity, product_quantity
 */
export interface IProductionOrderTestType extends Omit<
  IProductionOrder,
  "delivered_product_quantity" | "product_quantity"
> {
  product_quantity: number;
  delivered_product_quantity: number;
}
