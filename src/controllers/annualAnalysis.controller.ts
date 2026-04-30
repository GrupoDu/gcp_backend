import type AnnualAnalysisService from "../services/annualAnalysis.service.js";
import type { Request, Response } from "express";
import type { IAnualAnalysis } from "../types/anualAnalysis.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";

/**
 * Controller responsável por gerenciar a análise anual.
 *
 * @class AnnualAnalysisController
 * @see AnnualAnalysisService
 */
class AnnualAnalysisController {
  private _annualAnalysisService: AnnualAnalysisService;

  /** @param {AnnualAnalysisService} annualAnalysisService - Serviço de análise anual */
  constructor(annualAnalysisService: AnnualAnalysisService) {
    this._annualAnalysisService = annualAnalysisService;
  }

  /**
   * Método responsável por buscar todas as análises anuais.
   *
   * @returns {Promise<Response>} Objeto com todas as análises anuais
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see AnnualAnalysisController
   */
  async getAllAnualAnalysisService(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const annualAnalysisData: IAnualAnalysis[] =
        await this._annualAnalysisService.getMontlyAnalysis();

      return res
        .status(200)
        .json(
          successResponseWith(
            annualAnalysisData,
            "Dados encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por atualizar a análise anual.
   *
   * @returns {Promise<Response>} Objeto com a análise anual atualizada
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see AnnualAnalysisController
   */
  async updateDeliveredAnualAnalysis(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const annualAnalysisUpdateResponse: string =
        await this._annualAnalysisService.updateDeliveredMontlyAnalysis();

      return res
        .status(200)
        .json(
          successResponseWith(
            annualAnalysisUpdateResponse,
            "Análise anual atualizada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default AnnualAnalysisController;
