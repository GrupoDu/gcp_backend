import type { Decimal } from "@prisma/client/runtime/client";

export interface IProductionOrder {
  production_order_id: string;
  production_order_title: string;
  production_order_description?: string | null;
  deliver_observation?: string | null;
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
}

export interface IProductionOrderCreate extends Omit<
  IProductionOrder,
  "production_order_id" | "created_at"
> {}

export interface IProductionOrderUpdate extends Partial<
  Omit<IProductionOrder, "production_order_id">
> {}
