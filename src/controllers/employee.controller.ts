import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type EmployeeService from "../services/employee.service.js";

class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  async getAllEmployeesData(req: Request, res: Response): Promise<Response> {
    try {
      const allEmployeesData = await this.employeeService.getAllEmployeesData();

      return res.status(200).json(allEmployeesData);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async getEmployeeData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      const employeeData = await this.employeeService.getEmployeeData(
        uuid as string,
      );

      return res.status(200).json(employeeData);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async createNewEmployee(req: Request, res: Response): Promise<Response> {
    try {
      const newEmployeeData = req.body;

      const newEmployee =
        await this.employeeService.registerNewEmployee(newEmployeeData);

      return res.status(201).json({
        message: "Funcionário adicionado ao sistema.",
        employee: newEmployee,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async removeEmployeeData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      await this.employeeService.removeEmployeeData(uuid as string);

      return res
        .status(200)
        .json({ message: "Funcionário removido do sistema." });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async updateEmployeeData(req: Request, res: Response): Promise<Response> {
    try {
      const updateEmployeeValues = req.body;
      const { uuid } = req.params;

      const updatedEmployee = await this.employeeService.updateEmployeeData(
        updateEmployeeValues,
        uuid as string,
      );

      return res.status(200).json({
        message: "Dados do funcionário atualizados.",
        udpate: updatedEmployee,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async incrementEmployeeActivityQuantity(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { uuid } = req.params;

      const updatedEmployeeActivity =
        await this.employeeService.incrementEmployeeActivitiesQuantity(
          uuid as string,
        );

      return res.status(200).json({
        message: "Quantidade de atividades atualizada.",
        udpate: updatedEmployeeActivity,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async incrementEmployeeProductsProducedQuantity(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { uuid } = req.params;
      const { productsQuantity } = req.body;

      const updatedEmployee =
        await this.employeeService.incrementEmployeeProductsProducedQuantity(
          uuid as string,
          productsQuantity,
        );

      return res.status(200).json({
        message: "Quantidade de produtos produzidos atualizada.",
        udpate: updatedEmployee,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default EmployeeController;
