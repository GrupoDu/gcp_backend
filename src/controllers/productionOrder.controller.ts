import type { Request, Response } from "express";
import type ProductionOrderService from "../services/productionOrder.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import type { IProductionOrderCreate } from "../types/productionOrder.interface.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

class ProductionOrderController {
  private _productionOrderService: ProductionOrderService;

  constructor(productionOrderService: ProductionOrderService) {
    this._productionOrderService = productionOrderService;
  }

  async getAllProductionOrders(req: Request, res: Response): Promise<Response> {
    try {
      const productionOrders =
        await this._productionOrderService.getAllProductionOrders();

      return res
        .status(200)
        .json(
          successResponseWith(
            productionOrders,
            "Dados encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async getProductionOrderById(req: Request, res: Response): Promise<Response> {
    const { production_order_id } = req.params;

    try {
      if (!production_order_id) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["production_order_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const targetProductionOrder =
        await this._productionOrderService.getProductionOrderById(
          production_order_id as string,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            targetProductionOrder,
            "Registro encontrado com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async createProductionOrder(req: Request, res: Response): Promise<Response> {
    try {
      const newProductionOrderValues: IProductionOrderCreate = req.body;
      const fields = Object.keys(newProductionOrderValues);

      if (isMissingFields(newProductionOrderValues)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const newProductionOrder =
        await this._productionOrderService.createNewProductionOrder(
          newProductionOrderValues,
        );

      return res
        .status(201)
        .json(
          successResponseWith(
            newProductionOrder,
            "Ordem de produção criada com sucesso.",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;

      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async removeProductionOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { production_order_id } = req.params;

      if (!production_order_id) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["production_order_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const removeResponse =
        await this._productionOrderService.removeProductionOrder(
          production_order_id as string,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            removeResponse,
            "Ordem de produção deletada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateProductionOrder(req: Request, res: Response): Promise<Response> {
    try {
      const ProductionOrderNewValues = req.body;
      const { production_order_id } = req.params;

      if (!production_order_id) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["production_order_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const updatedProductionOrder =
        await this._productionOrderService.updateProductionOrder(
          ProductionOrderNewValues,
          production_order_id as string,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            updatedProductionOrder,
            "Ordem de produção atualizada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async deliverProductionOrder(req: Request, res: Response): Promise<Response> {
    const { production_order_id } = req.params;
    const { delivered_product_quantity, requested_product_quantity } = req.body;

    try {
      const deliveredAndRequestedQuantity = {
        delivered_product_quantity,
        requested_product_quantity,
      };
      const fields = Object.keys(deliveredAndRequestedQuantity);

      if (isMissingFields(deliveredAndRequestedQuantity)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const deliveredProductionOrder =
        await this._productionOrderService.deliverProductionOrder(
          production_order_id as string,
          delivered_product_quantity as number,
          requested_product_quantity as number,
        );

      return res.status(200).json({
        message: "Ordem de produção entregue com sucesso.",
        update: deliveredProductionOrder,
      });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(error.message);
    }
  }

  async stockProductionValidation(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { production_order_id } = req.params;

    try {
      if (!production_order_id) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["production_order_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this._productionOrderService.stockProductionValidation(
        production_order_id as string,
      );

      return res
        .status(200)
        .json(
          successResponseWith(
            "Validação realizada.",
            "Validação de estoque realizada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;

      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default ProductionOrderController;
