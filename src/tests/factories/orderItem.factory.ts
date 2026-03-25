import type { IOrderItemsTestType } from "../../types/orderItems.interface.js";
import { randomUUID } from "node:crypto";

export const orderItemFactory = (override = {}): IOrderItemsTestType => {
  return {
    order_item_id: randomUUID(),
    order_id: randomUUID(),
    product_id: randomUUID(),
    quantity: 100,
    unit_price: 100,
    ...override,
  };
};
