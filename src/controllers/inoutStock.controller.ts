import type InOutStockService from "../services/inoutStock.service.js";
import type { Request, Response } from "express";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

class InOutStockController {
  private inoutStockService: InOutStockService;

  constructor(inoutStockService: InOutStockService) {
    this.inoutStockService = inoutStockService;
  }

  async getInOutStockAnalysis(req: Request, res: Response): Promise<Response> {
    try {
      const inOutStockAnalysis =
        await this.inoutStockService.getInOutStockAnalysis();

      return res
        .status(200)
        .json(
          successResponseWith(
            inOutStockAnalysis,
            "Análise de estoque encontrada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async incrementMonthlyInStockQuantity(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { quantity } = req.body;

    try {
      if (!quantity) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["quantity"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this.inoutStockService.incrementMonthlyInStockQuantity(quantity);

      return res
        .status(200)
        .json(successResponseWith(null, "Estoque incrementado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async incrementMonthlyOutStockQuantity(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { quantity } = req.body;

    try {
      if (!quantity) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["quantity"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this.inoutStockService.incrementMonthlyOutStockQuantity(quantity);

      return res
        .status(200)
        .json(successResponseWith(null, "Estoque decrementado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default InOutStockController;
