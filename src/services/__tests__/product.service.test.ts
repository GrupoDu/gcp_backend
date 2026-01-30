import { describe, vi, it, beforeEach, expect } from "vitest";
import ProductService from "../product.service.js";
import type { IProduct } from "../../types/product.interface.js";
import { randomUUID } from "node:crypto";

vi.mock("../../../lib/prisma.ts");
import prisma from "../../tests/__mocks__/@prisma/prisma.js";

describe("Testes de produtos.", () => {
  let productService: ProductService;
  let productList: IProduct[];

  beforeEach(() => {
    productList = [
      {
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        name: "Carro de mão",
        description: "Descrição do produto deve ter informações importantes.",
        product_type: "Carro de mão",
        created_at: new Date(),
        image: "fake-image-url",
        features: ["asda", "asdfgfg", "pasipda"],
        acronym: "CDM",
        composition: {},
      },
      {
        uuid: randomUUID(),
        name: "Carro de mão",
        description: "Descrição do produto deve ter informações importantes.",
        product_type: "Carro de mão",
        created_at: new Date(),
        image: "fake-image-url",
        features: ["asda", "asdfgfg", "pasipda"],
        acronym: "CDM",
        composition: {},
      },
    ];

    productService = new ProductService(prisma);
  });

  it("Deve conseguir criar um novo produto.", async () => {
    const mockProductData = {
      uuid: randomUUID(),
      created_at: new Date(),
      description: "Descrição de um produto de teste.",
      image: "fake-image-url",
      name: "Produto de teste",
      product_type: "Carro de mão",
      features: [],
      acronym: "",
      composition: {},
    };

    prisma.products.create.mockResolvedValue(mockProductData);

    const newProduct = await productService.registerNewProduct(mockProductData);

    expect(newProduct.name).toBe("Produto de teste");
  });

  it("Deve conseguir atualizar um produto.", async () => {
    const mockUpdatedProduct = {
      created_at: new Date(),
      description: "Descrição de um produto de teste.",
      image: "fake-image-url",
      name: "Nome do produto atulizado",
      product_type: "Carro de mão",
      uuid: "550e8400-e29b-41d4-a716-446655440000",
      acronym: "",
      composition: {},
      features: [],
    };

    prisma.products.update.mockResolvedValue(mockUpdatedProduct);

    const updatedProduct = await productService.updateProductData(
      { name: "Nome do produto atulizado" },
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(updatedProduct.name).toBe("Nome do produto atulizado");
  });

  it("Deve retornar erro de nenhum campo fornecido.", async () => {
    await expect(
      productService.updateProductData(
        {},
        "550e8400-e29b-41d4-a716-446655440000",
      ),
    ).rejects.toThrowError();
  });
});
