import type { Decimal } from "../../generated/prisma/internal/prismaNamespace.js";

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
  product_uuid: string;
  client_uuid: string;
  delivered_product_quantity?: Decimal;
}

export interface IProductionOrderCreate extends Omit<
  IProductionOrder,
  "production_order_id" | "created_at" | "delivered_product_quantity"
> {}

export interface IProductionOrderUpdate extends Partial<
  Omit<IProductionOrder, "production_order_id">
> {}

export interface IProductionOrderDeliver extends Pick<IProductionOrder, "production_order_id" & "delivered_product_quantity" & "product_quantity"> {}
