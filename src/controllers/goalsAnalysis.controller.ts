import type { Request, Response } from "express";
import type GoalsAnalysisService from "../services/goalsAnalysis.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";

class GoalsAnalysisController {
  private goalsAnalysisService: GoalsAnalysisService;

  constructor(goalsAnalysisService: GoalsAnalysisService) {
    this.goalsAnalysisService = goalsAnalysisService;
  }

  async getGoalsAnalysis(req: Request, res: Response) {
    try {
      const goalsAnalysis = await this.goalsAnalysisService.getGoalsAnalysis();

      return res
        .status(200)
        .json(
          successResponseWith(
            goalsAnalysis,
            "Análise de metas encontrada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default GoalsAnalysisController;
