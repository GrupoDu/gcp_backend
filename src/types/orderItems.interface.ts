export interface IOrderItems {
  order_item_uuid: string;
  created_at: Date;
  quantity: number;
  unit_price: number;
  additional_amount?: number | undefined;
  total: number;
  discount_percentage?: number | undefined;
  ipi?: number | undefined;
  product_uuid: string;
  order_uuid: string;
}

/**
 * @extends {IOrderItems}
 * @Omit order_item_uuid
 */
export interface IOrderItemsCreate extends Omit<
  IOrderItems,
  "order_item_uuid" | "created_at"
> {}

/**
 * @extends {IOrderItems}
 * @Omit unit_price, quantity
 */
export interface IOrderItemsTestType extends Omit<
  IOrderItems,
  "unit_price" | "quantity"
> {
  unit_price: number;
  quantity: number;
}
