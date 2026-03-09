import { responseMessages } from "../constants/messages.constants.js";
import type StockUpdatesService from "../services/stockUpdates.service.js";
import type { Request, Response } from "express";

class StockUpdatesController {
  private stockUpdatesService: StockUpdatesService;

  constructor(stockUpdatesService: StockUpdatesService) {
    this.stockUpdatesService = stockUpdatesService;
  }

  async getStockUpdates(req: Request, res: Response): Promise<Response> {
    try {
      const stockUpdates = await this.stockUpdatesService.getStockUpdates();
      return res.status(200).json(stockUpdates);
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }

  async registerStockUpdate(req: Request, res: Response): Promise<Response> {
    const { product_quantity_title, event } = req.body;

    try {
      const isValuesEmpty = !product_quantity_title || !event;

      if (isValuesEmpty)
        return res.status(400).json({
          message:
            "Os campos 'product_quantity_title' e 'event' devem ser preenchidos.",
        });

      const stockUpdate = await this.stockUpdatesService.registerStockUpdate(
        product_quantity_title,
        event,
      );

      return res.status(200).json({
        message: "Atualização de estoque registrado.",
        data: stockUpdate,
      });
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }
}

export default StockUpdatesController;
