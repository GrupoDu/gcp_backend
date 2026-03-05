import type AnualAnalysisService from "../services/anualAnalysis.service.js";
import type { Request, Response } from "express";
import type { IAnualAnalysis } from "../types/anualAnalysis.interface.js";
import { responseMessages } from "../constants/messages.constants.js";

class AnualAnalysisController {
  private anualAnalysisService: AnualAnalysisService;

  constructor(anualAnalysisService: AnualAnalysisService) {
    this.anualAnalysisService = anualAnalysisService;
  }

  async getAllAnualAnalysisService(req: Request, res: Response) {
    try {
      const anualAnalysisData: IAnualAnalysis[] =
        await this.anualAnalysisService.getMontlyAnalysis();

      if (!anualAnalysisData) {
        throw new Error("Nenhum registro nos últimos meses");
      }

      return res.status(200).json(anualAnalysisData);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async updateDeliveredAnualAnalysis(req: Request, res: Response) {
    try {
      const anualAnalysisUpdateResponse: string =
        await this.anualAnalysisService.updateDeliveredMontlyAnalysis();

      return res.status(200).json({ message: anualAnalysisUpdateResponse });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default AnualAnalysisController;
