import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../lib/prisma.js");
vi.mock("../../services/orderItems.service.js", () => {
  const OrderService = vi.fn(
    class {
      getOrderItems = vi.fn();
      addItemsToOrder = vi.fn();
      removeItemFromOrder = vi.fn();
    },
  );

  return { OrderService };
});

import OrderItemsController from "../orderItems.controller.js";
import OrderItemsService from "../../services/orderItems.service.js";
import prisma from "../../tests/__mocks__/@prisma/prisma.js";
import { randomUUID } from "node:crypto";
import type { IOrderItemsTestType } from "../../types/orderItems.interface.js";
import { orderItemFactory } from "../../tests/factories/orderItem.factory.js";

const RETURN_MESSAGE = {
  GENERIC_ERROR: "Erro interno do servidor",
};

const createMocks = () => {
  const mockService = new OrderItemsService(prisma);
  const orderItemsController = new OrderItemsController(mockService);

  const mockReq = {
    params: {},
    body: {},
    query: {},
  };

  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };

  return {
    mockService,
    orderItemsController,
    mockReq,
    mockRes,
  };
};

describe("tests for getOrderItems.", () => {
  let mockService: any;
  let orderItemsController: any;
  let mockReq: any;
  let mockRes: any;
  let mockOrderItems: IOrderItemsTestType[];

  beforeEach(() => {
    vi.clearAllMocks();

    const mocks = createMocks();
    mockService = mocks.mockService;
    orderItemsController = mocks.orderItemsController;
    mockReq = mocks.mockReq;
    mockRes = mocks.mockRes;

    mockOrderItems = [
      orderItemFactory({ quantity: 200 }),
      orderItemFactory({ quantity: 800 }),
      orderItemFactory({ quantity: 80 }),
    ];
  });

  it("should return 200 and order items", async () => {
    const order_id = randomUUID();

    mockService.getOrderItems.mockResolvedValue(mockOrderItems);

    mockReq.params = { order_id };
    await orderItemsController.getOrderItems(mockReq, mockRes);

    // expect(mockService.getOrderItems).toHaveBeenCalledWith(order_id);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockOrderItems,
      message: "Itens do pedido encontrados com sucesso",
      success: true,
      status: 200,
    });
  });

  it("should return 400 error", async () => {
    mockService.getOrderItems.mockRejectedValue(
      new Error("Campos obrigatórios: order_id, product_id."),
    );

    await orderItemsController.getOrderItems(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
describe("tests for addItemsToOrder", () => {
  let mockService: any;
  let orderItemsController: any;
  let mockReq: any;
  let mockRes: any;
  let mockedItem: IOrderItemsTestType;

  beforeEach(() => {
    vi.clearAllMocks();

    const mocks = createMocks();
    mockService = mocks.mockService;
    orderItemsController = mocks.orderItemsController;
    mockReq = mocks.mockReq;
    mockRes = mocks.mockRes;

    mockedItem = orderItemFactory({ quantity: 200 });
  });

  it("should return status 200", async () => {
    mockService.addItemsToOrder.mockResolvedValue(mockedItem);

    mockReq.params = { order_id: mockedItem.order_id };
    mockReq.body = {
      product_id: mockedItem.product_id,
      quantity: mockedItem.quantity,
      unit_price: mockedItem.unit_price,
    };

    await orderItemsController.addItemsToOrder(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should return right response structure", async () => {
    mockService.addItemsToOrder.mockResolvedValue(mockedItem);

    mockReq.params = { order_id: mockedItem.order_id };
    mockReq.body = {
      product_id: mockedItem.product_id,
      quantity: mockedItem.quantity,
      unit_price: mockedItem.unit_price,
    };

    await orderItemsController.addItemsToOrder(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockedItem,
      message: "Item adicionado ao pedido com sucesso",
      success: true,
      status: 200,
    });
  });
});
describe("tests for removeItemFromOrder", () => {
  let mockService: any;
  let orderItemsController: any;
  let mockReq: any;
  let mockRes: any;
  let mockedItem: IOrderItemsTestType[];

  beforeEach(() => {
    vi.clearAllMocks();

    const mock = createMocks();
    mockService = mock.mockService;
    orderItemsController = mock.orderItemsController;
    mockReq = mock.mockReq;
    mockRes = mock.mockRes;

    mockedItem = [
      orderItemFactory({ quantity: 200 }),
      orderItemFactory({ quantity: 800 }),
      orderItemFactory({ quantity: 80 }),
    ];
  });

  it("should return status 200", async () => {
    mockService.removeItemFromOrder.mockResolvedValue(
      "Item removido do pedido com sucesso",
    );

    mockReq.params = { order_id: mockedItem[0]?.order_id };
    mockReq.body = { product_id: mockedItem[0]?.product_id };

    await orderItemsController.removeItemFromOrder(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should return right response structure", async () => {
    mockService.removeItemFromOrder.mockResolvedValue(
      "Item removido do pedido com sucesso",
    );

    mockReq.params = { order_id: mockedItem[0]?.order_id };
    mockReq.body = { product_id: mockedItem[0]?.product_id };

    await orderItemsController.removeItemFromOrder(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      data: "Item removido do pedido com sucesso",
      message: "Item do pedido removido com sucesso",
      success: true,
      status: 200,
    });
  });
});
