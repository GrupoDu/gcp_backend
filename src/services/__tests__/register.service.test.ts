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

  it("Deve editar título do registro.", async () => {
    const mockedTitleUpdateRegister = mockedRegisterFactory({
      title: "Update de título",
    });

    prisma.register.update.mockResolvedValue(mockedTitleUpdateRegister);

    const updateRegister = await registerService.updateRegisterData(
      mockedTitleUpdateRegister,
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(updateRegister.title).toBe("Update de título");
    expect(updateRegister.register_id).toBe(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });

  it("Deve editar descrição do registro.", async () => {
    const mockedDescriptionUpdateRegister = mockedRegisterFactory({
      description: "Atualizando a descrição desse registro.",
    });

    prisma.register.update.mockResolvedValue(mockedDescriptionUpdateRegister);

    const updateRegister = await registerService.updateRegisterData(
      mockedDescriptionUpdateRegister,
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(updateRegister.description).toBe(
      "Atualizando a descrição desse registro.",
    );
    expect(updateRegister.register_id).toBe(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });
});
