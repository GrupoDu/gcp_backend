import type { Request, Response } from "express";
import type RegisterAnalysisService from "../services/productionOrderAnalysis.service.js";
import { responseMessages } from "../constants/messages.constants.js";

class ProductionOrderAnalysisController {
  constructor(private registerAnalysisService: RegisterAnalysisService) {}

  async getProductionOrderAnalysis(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const registersDataAnalysis =
        await this.registerAnalysisService.registerDataAnalysis();

      if (registersDataAnalysis.deliveredRegisterQuantity < 0) {
        return res
          .status(200)
          .json({ message: "Não houve ordem de produção entregues esse mês" });
      }

      if (registersDataAnalysis.notDeliveredRegisterQuantity < 0) {
        return res
          .status(200)
          .json({
            message: "Não houve ordem de produção não entregues esse mês",
          });
      }

      return res.status(200).json(registersDataAnalysis);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default ProductionOrderAnalysisController;
