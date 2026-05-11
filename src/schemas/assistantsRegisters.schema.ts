import * as z from "zod";

/**
 * Schema para validação de assistentes de produção
 * @see {IAssistantsRegister}
 */
export const AssistantsRegisterSchema = z.object({
  assistant_register_uuid: z.string().uuid(),
  is_delivered: z.boolean(),
  delivered_at: z.date().optional().nullable(),
  produced_quantity: z.number().int().nonnegative(),
  assistant_uuid: z.string().uuid(),
  assistant_as: z.string(),
});

/**
 * Schema de validação para criação de registros de assistentes de produção
 * @see {IAssistantsRegisterCreate}
 */
export const AssistantsRegisterCreateSchema =
  AssistantsRegisterSchema.omit({
    assistant_register_uuid: true,
    delivered_at: true,
    is_delivered: true,
  });

/**
 * Schema para validação de identificadores de registros de assistentes de produção
 */
const AssistantRegisterIdentifiers = AssistantsRegisterSchema.omit({
  assistant_register_uuid: true,
  is_delivered: true,
  delivered_at: true,
  produced_quantity: true,
});

export default AssistantRegisterIdentifiers;
