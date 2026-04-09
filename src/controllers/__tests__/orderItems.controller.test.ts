vi.mock("../../../lib/prisma.js");
vi.mock("../../services/orderItems.service.js", () => {
  const OrderService = vi.fn(
    class {
      getOrderItems = vi.fn();
      addItemsToOrder = vi.fn();
      removeItemFromOrder = vi.fn();
    },
  );

  return {
    default: OrderService,
  };
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import OrderItemsController from "../orderItems.controller.js";
import OrderItemsService from "../../services/orderItems.service.js";
import prisma from "../../tests/__mocks__/@prisma/prisma.js";
import { randomUUID } from "node:crypto";
import type { IOrderItemsTestType } from "../../types/orderItems.interface.js";
import { orderItemFactory } from "../../tests/factories/orderItem.factory.js";
import { createControllerMocks } from "../../tests/helpers/createControllerMocks.js";

describe("=== OrderItemsController Tests ===", () => {
  let mockService: any;
  let orderItemsController: any;
  let mockReq: any;
  let mockRes: any;
  let mockedOrderItems: IOrderItemsTestType[];
  let mockedOrderItem: IOrderItemsTestType;

  beforeEach(() => {
    vi.clearAllMocks();

    const mocks = createControllerMocks(
      OrderItemsService,
      OrderItemsController,
      prisma,
    );
    mockService = mocks.mockService;
    orderItemsController = mocks.controller;
    mockReq = mocks.mockReq;
    mockRes = mocks.mockRes;

    mockedOrderItems = [
      orderItemFactory({ quantity: 200 }),
      orderItemFactory({ quantity: 800 }),
      orderItemFactory({ quantity: 80 }),
    ];
    mockedOrderItem = orderItemFactory({ quantity: 200 });
  });

  describe("tests for getOrderItems.", () => {
    it("should return 200 and order items", async () => {
      const order_id = randomUUID();

      mockService.getOrderItems.mockResolvedValue(mockedOrderItems);

      mockReq.params = { order_id };
      await orderItemsController.getOrderItems(mockReq, mockRes);

      // expect(mockService.getOrderItems).toHaveBeenCalledWith(order_id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockedOrderItems,
        message: "Itens do pedido encontrados com sucesso",
        success: true,
        status: 200,
      });
    });

    it("should return 422 error", async () => {
      mockService.getOrderItems.mockRejectedValue(
        new Error("Campos obrigatórios: order_id, product_id."),
      );

      await orderItemsController.getOrderItems(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(422);
    });
  });
  describe("tests for addItemsToOrder", () => {
    it("should return status 201", async () => {
      mockService.addItemsToOrder.mockResolvedValue(mockedOrderItem);

      mockReq.params = { order_id: mockedOrderItem.order_id };
      mockReq.body = {
        product_id: mockedOrderItem.product_id,
        quantity: mockedOrderItem.quantity,
        unit_price: mockedOrderItem.unit_price,
      };

      await orderItemsController.addItemsToOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it("should return right response structure", async () => {
      mockService.addItemsToOrder.mockResolvedValue(mockedOrderItem);

      mockReq.params = { order_id: mockedOrderItem.order_id };
      mockReq.body = {
        product_id: mockedOrderItem.product_id,
        quantity: mockedOrderItem.quantity,
        unit_price: mockedOrderItem.unit_price,
      };

      await orderItemsController.addItemsToOrder(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockedOrderItem,
        message: "Item adicionado ao pedido com sucesso",
        success: true,
        status: 201,
      });
    });
  });
  describe("tests for removeItemFromOrder", () => {
    it("should return status 200", async () => {
      mockService.removeItemFromOrder.mockResolvedValue(
        "Item removido do pedido com sucesso",
      );

      mockReq.params = { order_id: mockedOrderItems[0]?.order_id };
      mockReq.body = { product_id: mockedOrderItems[0]?.product_id };

      await orderItemsController.removeItemFromOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return right response structure", async () => {
      mockService.removeItemFromOrder.mockResolvedValue(
        "Item removido do pedido com sucesso",
      );

      mockReq.params = { order_id: mockedOrderItems[0]?.order_id };
      mockReq.body = { product_id: mockedOrderItems[0]?.product_id };

      await orderItemsController.removeItemFromOrder(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        data: "Item removido do pedido com sucesso",
        message: "Item do pedido removido com sucesso",
        success: true,
        status: 200,
      });
    });
  });
});
