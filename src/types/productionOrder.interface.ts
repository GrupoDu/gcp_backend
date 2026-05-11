export interface IProductionOrder {
  production_order_uuid: string;
  created_at: Date;
  production_order_deadline: Date;
  production_order_status: string;
  quantity_to_produce: number;
  produced_quantity: number;
  supervisor_uuid: string | null;
  product_uuid: string;
  delivered_at?: Date | null;
  delivered_product_quantity?: number;
  delivery_observation?: string | null;
  stock_validation?: boolean;
  production_order_description?: string | null;
  welder_uuid?: string | null;
  order_uuid: string;
}

/**
 * Campos omitidos na criação de ordem de produção
 * @see {IProductionOrder}
 */
type createOmitFields =
  | "production_order_uuid"
  | "created_at"
  | "delivered_product_quantity"
  | "stock_validation"
  | "delivered_at";

/**
 * @see {IProductionOrder}
 * @extends {IProductionOrder}
 * @Omit production_order_uuid, created_at, delivered_product_quantity, stock_validation, delivered_at
 */
export interface IProductionOrderCreate extends Omit<
  IProductionOrder,
  createOmitFields
> {
  delivered_product_quantity: number;
}

/**
 * @see {IProductionOrder}
 * @extends {IProductionOrder}
 * @Omit production_order_uuid
 */
export interface IProductionOrderUpdate extends Partial<
  Omit<IProductionOrder, "production_order_uuid">
> {}

/**
 * @see {IProductionOrder}
 * @extends {IProductionOrder}
 * @Pick production_order_uuid, delivered_product_quantity, quantity_to_produce
 */
export interface IProductionOrderDeliver extends Pick<
  IProductionOrder,
  "production_order_uuid" | "delivered_product_quantity" | "quantity_to_produce"
> {}

/**
 * @see {IProductionOrder}
 * @extends {IProductionOrder}
 * @Omit delivered_product_quantity, quantity_to_produce
 */
export interface IProductionOrderTestType extends Omit<
  IProductionOrder,
  "delivered_product_quantity" | "quantity_to_produce"
> {
  quantity_to_produce: number;
  delivered_product_quantity: number;
}
