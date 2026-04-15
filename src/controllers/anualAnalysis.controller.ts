import type AnualAnalysisService from "../services/anualAnalysis.service.js";
import type { Request, Response } from "express";
import type { IAnualAnalysis } from "../types/anualAnalysis.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";

/**
 * Controller responsável por gerenciar a análise anual.
 *
 * @class AnualAnalysisController
 * @see AnualAnalysisService
 */
class AnualAnalysisController {
  private _anualAnalysisService: AnualAnalysisService;

  /** @param {AnualAnalysisService} anualAnalysisService - Serviço de análise anual */
  constructor(anualAnalysisService: AnualAnalysisService) {
    this._anualAnalysisService = anualAnalysisService;
  }

  /**
   * Método responsável por buscar todas as análises anuais.
   *
   * @returns {Promise<Response>} Objeto com todas as análises anuais
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @see AnualAnalysisController
   */
  async getAllAnualAnalysisService(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const anualAnalysisData: IAnualAnalysis[] =
        await this._anualAnalysisService.getMontlyAnalysis();

      return res
        .status(200)
        .json(
          successResponseWith(
            anualAnalysisData,
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
   * @see AnualAnalysisController
   */
  async updateDeliveredAnualAnalysis(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const anualAnalysisUpdateResponse: string =
        await this._anualAnalysisService.updateDeliveredMontlyAnalysis();

      return res
        .status(200)
        .json(
          successResponseWith(
            anualAnalysisUpdateResponse,
            "Análise anual atualizada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default AnualAnalysisController;
