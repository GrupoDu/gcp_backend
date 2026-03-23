export interface IOrder {
  order_id: string;
  created_at: Date;
  order_status: string;
  order_deadline: Date;
  order_title: string;
  order_description: string | null;
  product_quantity: number;
  delivery_observation: string | null;
  product_type: string;
  product_uuid: string;
}

export interface IOrderCreate extends Omit<
  IOrder,
  "order_id" | "created_at" | "order_status"
> {}

export interface IOrderUpdate extends Partial<IOrder> {}
