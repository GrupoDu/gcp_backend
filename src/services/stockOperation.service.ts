import type {
  IStockOperationCreate,
  IStockOperationResult,
} from "../types/stockOperation.interface.js";
import StockUpdatesService from "./stockUpdates.service.js";
import InOutStockService from "./inoutStock.service.js";
import ProductService from "./product.service.js";
import ProductionOrderService from "./productionOrder.service.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { Decimal } from "@prisma/client/runtime/wasm-compiler-edge";

/**
 * Service responsável por gerenciar operações combinadas de estoque.
 *
 * @class StockOperationService
 * @see StockOperationController
 */
class StockOperationService {
  private _prisma: PrismaClient;
  private _stockUpdatesService: StockUpdatesService;
  private _inoutStockService: InOutStockService;
  private _productService: ProductService;
  private _productionOrderService: ProductionOrderService;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
    this._stockUpdatesService = new StockUpdatesService(prisma);
    this._inoutStockService = new InOutStockService(prisma);
    this._productService = new ProductService(prisma);
    this._productionOrderService = new ProductionOrderService(prisma);
  }

  /**
   * Executa operação combinada de estoque.
   *
   * @param {IStockOperationCreate} stockOperationData - Dados da operação de estoque
   * @returns {Promise<IStockOperationResult>} - Resultado da operação combinada
   * @see {IStockOperationCreate}
   * @see {IStockOperationResult}
   * @see {StockUpdatesService}
   * @see {InOutStockService}
   * @see {ProductService}
   * @see {ProductionOrderService}
   */
  async processStockOperation(
    stockOperationData: IStockOperationCreate,
  ): Promise<IStockOperationResult> {
    const {
      product_quantity_title,
      event,
      inStockIncrementQuantity,
      product_id,
      validation,
      production_order_id,
      producedQuantity,
    } = stockOperationData;

    return await this._prisma.$transaction(async () => {
      const stockUpdate = await this._stockUpdatesService.registerStockUpdate(
        product_quantity_title,
        event,
      );

      await this._productionOrderService.updateProductionOrder(
        { stock_validation: validation },
        production_order_id,
      );

      await this._productService.updateProductData(
        { stock_quantity: producedQuantity },
        product_id,
      );

      await this._inoutStockService.incrementMonthlyInStockQuantity(
        inStockIncrementQuantity,
      );

      return {
        stockUpdate,
        productionValidation: "Validação realizada com sucesso",
        stockIncrement: "Estoque incrementado com sucesso",
      };
    });
  }
}

export default StockOperationService;
