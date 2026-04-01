export interface IAssistantsPORegisters {
  assistants_po_registers_uuid: string;
  delivered: boolean;
  delivered_at?: Date | null;
  production_order_uuid: string;
  assistant_uuid: string;
  assistant_as: string;
}

/**
 * @extends {IAssistantsPORegisters}
 * @omit assistants_po_registers_uuid, delivered_at
 * @see {IAssistantsPORegisters}
 */
export interface IAssistantsPORegisterCreate extends Omit<
  IAssistantsPORegisters,
  "assistants_po_registers_uuid" | "delivered_at"
> {}

/**
 * @extends {IAssistantsPORegisters}
 * @Omit assistants_po_registers_uuid, delivered, delivered_at
 * @see {IAssistantsPORegisters}
 */
export interface IAssistantPORegisterIdentifiers extends Omit<
  IAssistantsPORegisters,
  "assistants_po_registers_uuid" | "delivered" | "delivered_at"
> {}
