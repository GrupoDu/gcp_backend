import { Prisma } from "../../../generated/prisma/client.ts";

export const mockedRegisterFactory = (overrides = {}) => ({
  register_id: "550e8400-e29b-41d4-a716-446655440000",
  created_at: new Date(),
  title: "Título do registro",
  deadline: new Date(2025, 3, 5),
  description: "Descrição do registro com observações e detalhes importantes",
  status: "Pendente",
  client_uuid: "03899d9f-0c34-4458-8883-1e8523bc14b5",
  product_quantity: new Prisma.Decimal("100.00"),
  product_uuid: "a25a26f7-0e2c-48e9-a7e2-b92772784f87",
  employee_uuid: null,
  cut_assistant: null,
  deliver_observation: null,
  delivered_at: null,
  finishing_assistant: null,
  fold_assistant: null,
  paint_assistant: null,

  ...overrides,
});
