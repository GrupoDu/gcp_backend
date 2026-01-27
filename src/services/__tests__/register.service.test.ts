import { describe, it, beforeEach, expect } from "vitest";
import RegisterService from "../register.service.js";
import { prisma } from "../../../lib/prisma.js";
import type { IRegister } from "../../types/register.interface.js";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";

describe("Testes de criação de registro.", () => {
  let registerService: RegisterService;

  beforeEach(() => {
    registerService = new RegisterService(prisma);
  });

  it("Deve conseguir criar um novo registro.", async () => {
    const newRegister: IRegister = await registerService.createNewRegister({
      title: "Título do registro",
      deadline: new Date(2025, 3, 5),
      description:
        "Descrição do registro com observações e detalhes importantes",
      status: "Pendente",
      client_uuid: randomUUID(),
      product_quantity: new Prisma.Decimal("100.00"),
      product_uuid: randomUUID(),
    });

    expect(newRegister.title).toBe("Título do registro");
  });
});
