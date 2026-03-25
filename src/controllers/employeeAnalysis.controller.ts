import type { Request, Response } from "express";
import type EmployeeAnalysisService from "../services/employeeAnalysis.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

class EmployeeAnalysisController {
  private _employeeAnalysisService: EmployeeAnalysisService;

  constructor(employeeAnalysisService: EmployeeAnalysisService) {
    this._employeeAnalysisService = employeeAnalysisService;
  }

  async getEmployeeActivityAnalysis(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { employee_id } = req.body;

      if (!employee_id) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["employee_id"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const employeeAnalysis =
        await this._employeeAnalysisService.employeeActivityAnalysis(
          employee_id,
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
