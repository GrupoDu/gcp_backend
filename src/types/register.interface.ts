import type { Decimal } from "@prisma/client/runtime/client";

export interface IRegister {
  register_id: string;
  title: string;
  description?: string | null;
  deliver_observation?: string | null;
  created_at: Date;
  deadline: Date;
  status: string;
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

export interface IRegisterCreate extends Omit<
  IRegister,
  "register_id" | "created_at"
> {}

export interface IRegisterUpdate extends Partial<
  Omit<IRegister, "register_id">
> {}
