import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../lib/prisma.js");
vi.mock("../../services/productionOrder.service.js", () => {
  const ProductionOrderService = vi.fn(
    class {
      getAllProductionOrders = vi.fn();
      getProductionOrderById = vi.fn();
      createProductionOrder = vi.fn();
      removeProductionOrder = vi.fn();
      updateProductionOrder = vi.fn();
      deliverProductionOrder = vi.fn();
      stockProductionValidation = vi.fn();
    },
  );

  return { default: ProductionOrderService };
});

import ProductionOrderService from "../../services/productionOrder.service.js";
import ProductionOrderController from "../productionOrder.controller.js";
import prisma from "../../tests/__mocks__/@prisma/prisma.js";
import type { IProductionOrderTestType } from "../../types/productionOrder.interface.js";
import { createControllerMocks } from "../../tests/helpers/createControllerMocks.js";
import { productionOrderFactory } from "../../tests/factories/productionOrder.factory.js";
import successResponseWith from "../../utils/successResponseWith.js";
import createMissingFieldsTests from "../../tests/helpers/createMissingFieldsTests.js";
import errorResponseWith from "../../utils/errorResponseWith.js";
import { CreateProductionOrderSchema } from "../../schemas/productionOrder.schema.js";
import checkMissingFields from "../../utils/checkMissingFields.js";

describe("=== Testes ProductionOrderController ===", () => {
  let mockService: any;
  let productionOrderController: any;
  let mockReq: any;
  let mockRes: any;
  let mockProductionOrdersList: IProductionOrderTestType[];
  let mockProductionOrder: IProductionOrderTestType;

  beforeEach(() => {
    vi.resetAllMocks();

    const mocks = createControllerMocks(
      ProductionOrderService,
      ProductionOrderController,
      prisma,
    );

    mockService = mocks.mockService;
    productionOrderController = mocks.controller;
    mockReq = mocks.mockReq;
    mockRes = mocks.mockRes;

    mockProductionOrdersList = [
      productionOrderFactory({ product_quantity: 100 }),
      productionOrderFactory({ product_quantity: 200 }),
      productionOrderFactory({ product_quantity: 70 }),
    ];

    mockProductionOrder = productionOrderFactory({ product_quantity: 90 });
  });

  describe("== getAllProductionOrders ==", () => {
    it("should return status 200", async () => {
      mockService.getAllProductionOrders.mockResolvedValue(
        mockProductionOrdersList,
      );

      await productionOrderController.getAllProductionOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return right json structure", async () => {
      mockService.getAllProductionOrders.mockResolvedValue(
        mockProductionOrdersList,
      );

      await productionOrderController.getAllProductionOrders(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        successResponseWith(
          mockProductionOrdersList,
          "Dados encontrados com sucesso.",
        ),
      );
    });
  });

  describe("422 status status", () => {
    let productionOrderController: any;
    let mockRes: any;
    let mockProductionOrder: IProductionOrderTestType;

    beforeEach(() => {
      vi.resetAllMocks();

      const mocks = createControllerMocks(
        ProductionOrderService,
        ProductionOrderController,
        prisma,
      );

      productionOrderController = mocks.controller;
      mockRes = mocks.mockRes;

      mockProductionOrder = productionOrderFactory({ product_quantity: 90 });
    });

    createMissingFieldsTests(
      "createProductionOrder",
      (req, res) => productionOrderController.createProductionOrder(req, res),
      [
        {
          description: "missing body values",
          setup: () => ({
            req: {
              body: { production_order_description: undefined },
            },
            res: mockRes,
          }),
        },
      ],
    );

    createMissingFieldsTests(
      "removeProductionOrder",
      (req, res) => productionOrderController.removeProductionOrder(req, res),
      [
        {
          description: "missing production_order_id",
          setup: () => ({
            req: { params: {} },
            res: mockRes,
          }),
        },
      ],
    );

    createMissingFieldsTests(
      "updateProductionOrder",
      (req, res) => productionOrderController.updateProductionOrder(req, res),
      [
        {
          description: "missing production_order_id",
          setup: () => ({
            req: { params: {}, body: {} },
            res: mockRes,
          }),
        },
      ],
    );

    createMissingFieldsTests(
      "stockProductionValidation",
      (req, res) =>
        productionOrderController.stockProductionValidation(req, res),
      [
        {
          description: "missing production_order_id",
          setup: () => ({
            req: { params: {} },
            res: mockRes,
          }),
        },
      ],
    );
  });
  describe("Error json", () => {
    let productionOrderController: any;
    let mockRes: any;
    let mockReq: any;
    let mockProductionOrder: IProductionOrderTestType;

    beforeEach(() => {
      vi.resetAllMocks();

      const mocks = createControllerMocks(
        ProductionOrderService,
        ProductionOrderController,
        prisma,
      );

      productionOrderController = mocks.controller;
      mockRes = mocks.mockRes;
      mockReq = mocks.mockReq;

      mockProductionOrder = productionOrderFactory({ product_quantity: 90 });
    });

    it("should return error json", async () => {
      mockReq.body = {
        production_order: "campo incorreto!",
      };
      const { schemaErr, requiredFieldsMessage } = checkMissingFields(
        mockReq.body,
        CreateProductionOrderSchema,
      );

      await productionOrderController.createProductionOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith(
        errorResponseWith(requiredFieldsMessage, 422, schemaErr),
      );
    });
  });

  describe("== getProductionOrderById ==", () => {
    it("should return status 200", async () => {
      mockService.getProductionOrderById.mockResolvedValue(mockProductionOrder);

      mockReq.params = {
        production_order_id: mockProductionOrder.production_order_id,
      };

      await productionOrderController.getProductionOrderById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 'successResponseWith' json structure", async () => {
      mockService.getProductionOrderById.mockResolvedValue(mockProductionOrder);

      mockReq.params = {
        production_order_id: mockProductionOrder.production_order_id,
      };

      await productionOrderController.getProductionOrderById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        successResponseWith(
          mockProductionOrder,
          "Dado encontrado com sucesso.",
        ),
      );
    });

    it("should return status 422 for missing fields", async () => {
      mockReq.params = {};

      await productionOrderController.getProductionOrderById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(422);
    });
  });

  describe("== createProductionOrder ==", () => {
    it("should return 'successResponseWith' structure", async () => {
      mockService.createProductionOrder.mockResolvedValue(mockProductionOrder);

      mockReq.body = {
        production_order_description: "aaaaaaa",
        production_order_status: mockProductionOrder.production_order_status,
        production_order_title: mockProductionOrder.production_order_title,
        delivery_observation: "aaaaaaa",
        production_order_deadline:
          mockProductionOrder.production_order_deadline,
        product_quantity: mockProductionOrder.product_quantity,
      };

      await productionOrderController.createProductionOrder(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        successResponseWith(
          mockProductionOrder,
          "Ordem de produção criada com sucesso.",
          201,
        ),
      );
    });
  });

  describe("== updateProductionOrder ==", () => {});
});
