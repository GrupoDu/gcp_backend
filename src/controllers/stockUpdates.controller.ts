import type StockUpdatesService from "../services/stockUpdates.service.js";
import type { Request, Response } from "express";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

class StockUpdatesController {
  private stockUpdatesService: StockUpdatesService;

  constructor(stockUpdatesService: StockUpdatesService) {
    this.stockUpdatesService = stockUpdatesService;
  }

  async getStockUpdates(req: Request, res: Response): Promise<Response> {
    try {
      const stockUpdates = await this.stockUpdatesService.getStockUpdates();
      return res
        .status(200)
        .json(
          successResponseWith(
            stockUpdates,
            "Atualizações de estoque encontradas com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async registerStockUpdate(req: Request, res: Response): Promise<Response> {
    const { product_quantity_title, event } = req.body;
    const stockData = { product_quantity_title, event };

    try {
      if (isMissingFields(stockData)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["product_quantity_title", "event"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const stockUpdate = await this.stockUpdatesService.registerStockUpdate(
        product_quantity_title,
        event,
      );

      return res
        .status(201)
        .json(
          successResponseWith(
            stockUpdate,
            "Atualização de estoque registrado.",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default StockUpdatesController;
