import { Decimal } from "@prisma/client/runtime/wasm-compiler-edge";

export interface IOrderItemsDetails {
  order_item_id: string;
  product_id: string;
  order_id: string;
  unit_price: Decimal;
  quantity: Decimal;
}

export interface IOrderItemsCreate extends Omit<
  IOrderItemsDetails,
  "order_item_id"
> {}

export interface IOrderItemsTestType extends Omit<
  IOrderItemsDetails,
  "unit_price" | "quantity"
> {
  unit_price: number;
  quantity: number;
}
