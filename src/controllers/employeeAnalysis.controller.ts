import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type EmployeeAnalysisService from "../services/employeeAnalysis.service.js";

class EmployeeAnalysisController {
  constructor(private employeeAnalysisService: EmployeeAnalysisService) {}

  async getEmployeeActivityAnalysis(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { employee_id } = req.body;

      const employeeAnalysis =
        await this.employeeAnalysisService.employeeActivityAnalysis(
          employee_id,
        );

      return res.status(500).json(employeeAnalysis);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default EmployeeAnalysisController;
