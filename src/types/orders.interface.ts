export interface IOrder {
  order_id: string;
  created_at: Date;
  order_status: string;
  order_deadline: Date;
  order_title: string;
  order_description: string | null;
  delivery_observation: string | null;
}

/**
 * @see {IOrder}
 * @extends {IOrder}
 * @Omit order_id, created_at, order_status
 */
export interface IOrderCreate extends Omit<
  IOrder,
  "order_id" | "created_at" | "order_status"
> {}

/**
 * @see {IOrder}
 * @extends {IOrder}
 */
export interface IOrderUpdate extends Partial<IOrder> {}
