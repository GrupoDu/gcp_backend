export interface IOrderItems {
  order_item_uuid: string;
  product_uuid: string;
  order_uuid: string;
  unit_price: number;
  quantity: number;
  discount_percentage: number;
  ipi: number;
  additional_amount: number;
  total: number;
}

/**
 * @extends {IOrderItemsDetails}
 * @see {IOrderItemsDetails}
 * @Omit order_item_id
 */
export interface IOrderItemsCreate extends Omit<
  IOrderItems,
  "order_item_uuid"
> {}

/**
 * @see {IOrderItemsDetails}
 * @extends {IOrderItemsDetails}
 * @Omit unit_price, quantity
 */
export interface IOrderItemsTestType extends Omit<
  IOrderItems,
  "unit_price" | "quantity"
> {
  unit_price: number;
  quantity: number;
}
