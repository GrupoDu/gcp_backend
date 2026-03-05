import { responseMessages } from "../constants/messages.constants.js";
import type InOutStockService from "../services/inoutStock.service.js";
import type { Request, Response } from "express";

class InOutStockController {
  private inoutStockService: InOutStockService;

  constructor(inoutStockService: InOutStockService) {
    this.inoutStockService = inoutStockService;
  }

  async getInOutStockAnalysis(req: Request, res: Response): Promise<Response> {
    try {
      const inOutStockAnalysis =
        await this.inoutStockService.getInOutStockAnalysis();

      return res.status(200).json(inOutStockAnalysis);
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
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
          .status(400)
          .json({ message: "Quantidade de produtos produzidos obrigatorio." });
      }

      await this.inoutStockService.incrementMonthlyInStockQuantity(quantity);

      return res
        .status(200)
        .json({ message: "Estoque incrementado com sucesso." });
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
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
          .status(400)
          .json({ message: "Quantidade de produtos produzidos obrigatorio." });
      }

      await this.inoutStockService.incrementMonthlyOutStockQuantity(quantity);

      return res
        .status(200)
        .json({ message: "Estoque incrementado com sucesso." });
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }
}

export default InOutStockController;
