export interface IAssistantsRegister {
  assistant_register_uuid: string;
  is_delivered: boolean;
  produced_quantity: number;
  assistant_as: string;
  assistant_uuid: string;
  delivered_at?: Date | null;
}

/**
 * @extends {IAssistantsRegister}
 * @omit assistant_register_uuid, delivered_at
 */
export interface IAssistantsRegisterCreate extends Omit<
  IAssistantsRegister,
  "assistant_register_uuid" | "delivered_at"
> {}

/**
 * @extends {IAssistantsRegister}
 * @omit assistant_register_uuid, is_delivered, delivered_at
 */
export interface IAssistantsRegisterIdentifiers extends Omit<
  IAssistantsRegister,
  "assistant_register_uuid" | "is_delivered" | "delivered_at"
> {}
