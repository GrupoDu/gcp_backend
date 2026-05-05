import type { IOrderItems } from "./orderItems.interface.js";
import type { IBilling } from "./billing.interface.js";
import type { IRevenue } from "./revenue.interface.js";
import type { IDelivery } from "./delivery.interface.js";

import type { IClient } from "./client.interface.js";

export interface IOrder {
  order_uuid: string;
  created_at: Date;
  order_status: string;
  order_deadline: Date;
  order_items: IOrderItems[];
  billing: IBilling;
  revenue: IRevenue;
  delivery: IDelivery;
  client_uuid: string;
  clients: IClient;
  totalPrice: number;
}

export interface IOrderCreateInput {
  order_deadline: string | Date;
  billing_uuid: string;
  revenue_uuid: string;
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
