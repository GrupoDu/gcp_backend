export interface IAssistantsPORegisters {
  assistants_po_registers_uuid: string;
  delivered: boolean;
  delivered_at?: Date | null;
  production_order_uuid: string;
  assistant_uuid: string;
  assistant_as: string;
}

export interface IAssistantsPORegisterCreate extends Omit<
  IAssistantsPORegisters,
  "assistants_po_registers_uuid" | "delivered_at"
> {}

export interface IAssistantPORegisterIdentifiers extends Omit<
  IAssistantsPORegisters,
  "assistants_po_registers_uuid" | "delivered" | "delivered_at"
> {}
