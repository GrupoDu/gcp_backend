import type { Request, Response } from "express";
import type EmployeeAnalysisService from "../services/employeeAnalysis.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import { hasValidString } from "../utils/hasValidString.js";

/**
 * Controller responsável por gerenciar as operações de análise de funcionários
 */
class EmployeeAnalysisController {
  private _employeeAnalysisService: EmployeeAnalysisService;

  /** @param {EmployeeAnalysisService} employeeAnalysisService - Serviço de análise de funcionários */
  constructor(employeeAnalysisService: EmployeeAnalysisService) {
    this._employeeAnalysisService = employeeAnalysisService;
  }

  /**
   * Método responsável por buscar análise de atividade de um funcionário
   */
  async getEmployeeActivityAnalysis(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { employee_uuid } = req.params;

    try {
      if (!hasValidString(employee_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["employee_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const employeeAnalysis =
        await this._employeeAnalysisService.employeeActivityAnalysis(
          employee_uuid,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            employeeAnalysis,
            "Análise de atividade do funcionário encontrada com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default EmployeeAnalysisController;
