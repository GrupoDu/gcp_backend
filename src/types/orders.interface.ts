import type { IOrderItems } from "./orderItems.interface.js";

export interface IOrder {
  order_uuid: string;
  created_at: Date;
  order_status: string;
  order_deadline: Date;
  order_items: IOrderItems[];
  billing_uuid: string;
  revenue_uuid: string;
  delivery_uuid: string;
  client_uuid: string;
  total_price: number;
}

export interface IOrderCreateInput {
  order_deadline: string | Date;
  billing: {
    client_uuid: string;
    billing_address: string;
    name?: string;
  };
  revenue: {
    revenue_address: string;
    revenue_cnpj: string;
    revenue_landline?: string | null;
    revenue_phone: string;
    revenue_email: string;
    client_uuid: string;
  };
  client_uuid: string;
  delivery: {
    delivery_address: string;
    building: string;
    reference?: string;
    delivery_observation?: string;
  };
  order_items: Array<{
    product_uuid: string;
    quantity: number;
    unit_price: number;
    discount_percentage?: number;
    ipi?: number;
    additional_amount?: number;
    total: number;
    order_uuid: string;
  }>;
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
