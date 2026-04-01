import * as z from "zod";

/**
 * Schema para validação de assistentes de produção
 * @see {IAssistantsPORegisters}
 */
export const AssistantsPORegistersSchema = z.object({
  assistants_po_registers_uuid: z.uuid(),
  delivered: z.boolean(),
  delivered_at: z.date().optional(),
  production_order_uuid: z.string(),
  assistant_uuid: z.string(),
  assistant_as: z.string(),
});

/**
 * Schema de validação para criação de registros de assistentes de produção
 * @see {IAssistantsPORegisterCreate}
 * @see {AssistantsPORegistersSchema}
 */
export const AssistantsPORegisterCreateSchema =
  AssistantsPORegistersSchema.omit({
    assistants_po_registers_uuid: true,
    delivered_at: true,
    delivered: true,
  });

/**
 * Schema para validação de identificadores de registros de assistentes de produção
 * @see {IAssistantsPORegisters}
 * @see {AssistantsPORegistersSchema}
 */
const AssistantPORegisterIdentifiers = AssistantsPORegistersSchema.omit({
  assistants_po_registers_uuid: true,
  delivered: true,
  delivered_at: true,
});
export default AssistantPORegisterIdentifiers;
