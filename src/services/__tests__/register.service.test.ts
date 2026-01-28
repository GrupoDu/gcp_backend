import { describe, it, beforeEach, expect, vi } from "vitest";
import RegisterService from "../register.service.js";
import { Prisma } from "@prisma/client";

vi.mock("../../../lib/prisma.js");

import prisma from "../../tests/__mocks__/@prisma/prisma.js";
import { randomUUID } from "node:crypto";
import type { IRegister } from "../../types/register.interface.js";
import { mockedRegisterFactory } from "../../tests/factories/register.factory.js";

describe("Testes de criação de registro.", () => {
  let registerService: RegisterService;

  beforeEach(() => {
    vi.clearAllMocks();
    registerService = new RegisterService(prisma);
  });

  it("Deve conseguir criar um novo registro.", async () => {
    const mockedRegister = mockedRegisterFactory();

    prisma.register.create.mockResolvedValue(mockedRegister);

    const newRegister = await registerService.createNewRegister(mockedRegister);

    expect(newRegister.title).toBe("Título do registro");
  });
});

describe("Testes de update de registro.", () => {
  let registerService: RegisterService;

  beforeEach(() => {
    vi.clearAllMocks();
    registerService = new RegisterService(prisma);
  });

  it("Deve editar nome de um registro.", async () => {
    const mockedUpdateRegister = mockedRegisterFactory({
      title: "Update de nome",
    });

    prisma.register.update.mockResolvedValue(mockedUpdateRegister);

    const updateRegister = await registerService.updateRegisterData(
      mockedUpdateRegister,
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(updateRegister.title).toBe("Update de nome");
    expect(updateRegister.register_id).toBe(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });
});
