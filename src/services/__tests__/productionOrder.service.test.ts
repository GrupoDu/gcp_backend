import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import ProductionOrderService from "../productionOrder.service.js";
import { mockedRegisterFactory } from "../../tests/factories/productionOrder.factory.js";
import jwt from "jsonwebtoken";

vi.mock("../../../lib/prisma.js");

import prisma from "../../tests/__mocks__/@prisma/prisma.js";

describe("Testes de criação de registro.", () => {
  let productionOrderService: ProductionOrderService;

  beforeEach(() => {
    vi.clearAllMocks();

    productionOrderService = new ProductionOrderService(prisma);
  });

  it("Deve conseguir criar um novo registro.", async ({ skip }) => {
    const mockedRegister = mockedRegisterFactory();

    prisma.production_order.create.mockResolvedValue(mockedRegister);

    const newRegister =
      await productionOrderService.createNewProductionOrder(mockedRegister);

    expect(newRegister.title).toBe("Título do registro");
  });
});

describe("Testes de update de registro.", () => {
  let productionOrderService: ProductionOrderService;
  let jwtVerifySpy: any;

  beforeEach(() => {
    vi.clearAllMocks();

    jwtVerifySpy = vi.spyOn(jwt, "verify");

    jwtVerifySpy.mockReturnValue({
      user_id: "123",
      user_type: "admin",
    });
    productionOrderService = new ProductionOrderService(prisma);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve editar título do registro.", async ({ skip }) => {
    const mockedTitleUpdateRegister = mockedRegisterFactory({
      title: "Update de título",
    });

    prisma.production_order.update.mockResolvedValue(mockedTitleUpdateRegister);

    const updateRegister = await productionOrderService.updateProductionOrder(
      mockedTitleUpdateRegister,
      "550e8400-e29b-41d4-a716-446655440000",
      jwtVerifySpy,
    );

    expect(updateRegister.title).toBe("Update de título");
    expect(updateRegister.production_order_id).toBe(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });

  it("Deve editar descrição do registro.", async ({ skip }) => {
    const mockedDescriptionUpdateRegister = mockedRegisterFactory({
      description: "Atualizando a descrição desse registro.",
    });

    prisma.production_order.update.mockResolvedValue(
      mockedDescriptionUpdateRegister,
    );

    const updateRegister = await productionOrderService.updateProductionOrder(
      mockedDescriptionUpdateRegister,
      "550e8400-e29b-41d4-a716-446655440000",
      jwtVerifySpy,
    );

    expect(updateRegister.description).toBe(
      "Atualizando a descrição desse registro.",
    );
    expect(updateRegister.production_order_id).toBe(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });

  it("Deve editar ajudante de corte.", async ({ skip }) => {
    const mockedCutAssistantUpdateRegister = mockedRegisterFactory({
      cut_assistant: "Sergio",
    });

    prisma.production_order.update.mockResolvedValue(
      mockedCutAssistantUpdateRegister,
    );

    const updateRegister = await productionOrderService.updateProductionOrder(
      mockedCutAssistantUpdateRegister,
      "550e8400-e29b-41d4-a716-446655440000",
      jwtVerifySpy,
    );

    expect(updateRegister.cut_assistant).toBe("Sergio");
  });

  it("Não deve permitir edição de registro.", () => {
    const mockedTitleUpdateRegister = mockedRegisterFactory({
      title: "Atualização de título",
    });

    jwtVerifySpy.mockImplementation(() => {
      throw new Error("Token invalido");
    });

    prisma.production_order.update.mockResolvedValue(mockedTitleUpdateRegister);

    expect(
      async () =>
        await productionOrderService.updateProductionOrder(
          mockedTitleUpdateRegister,
          "550e8400-e29b-41d4-a716-446655440000",
          jwtVerifySpy,
        ),
    ).toThrowError;
  });
});
