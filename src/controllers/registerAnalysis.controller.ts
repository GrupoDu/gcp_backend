import type { Request, Response } from "express";
import type RegisterAnalysisService from "../services/registersAnalysis.service.js";
import { responseMessages } from "../constants/messages.constants.js";
import type { IProductionAnalysis } from "../types/dataAnalysis.interface.js";
import { dataAnalysisAuthorizationMiddleware } from "../middlewares/dataAnalysisAuthorization.middleware.js";

class RegisterAnalysisController {
  constructor(private registerAnalysisService: RegisterAnalysisService) {}

  async getRegistersDataAnalysis(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const registersDataAnalysis: IProductionAnalysis =
        await this.registerAnalysisService.registerDataAnalysis();

      if (registersDataAnalysis.deliveredRegisterQuantity < 0) {
        return res
          .status(200)
          .json({ message: "Não houve registros entregues esse mês" });
      }

      if (registersDataAnalysis.notDeliveredRegisterQuantity < 0) {
        return res
          .status(200)
          .json({ message: "Não houve registros não entregues esse mês" });
      }

      return res.status(200).json(registersDataAnalysis);
    } catch (err) {
      return res
        .status(500)
        .json({
          message: responseMessages.catchErrorMessage,
          error: (err as Error).message,
        });
    }
  }
}

export default RegisterAnalysisController;
