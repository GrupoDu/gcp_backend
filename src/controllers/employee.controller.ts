import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import { prisma } from "../../lib/prisma.js";
import type { IEmployee } from "../types/models.interface.js";

class EmployeeController {
  async getAllEmployeesData(req: Request, res: Response): Promise<Response> {
    try {
      const allEmployeesData: IEmployee[] = await prisma.employee.findMany();

      return res.status(200).json(allEmployeesData);
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async createNewEmployee(req: Request, res: Response): Promise<Response> {
    try {
      const newEmployeeData = req.body;

      const newEmployee: IEmployee = await prisma.employee.create({
        data: newEmployeeData,
      });

      return res.status(201).json({
        message: "Funcionário adicionado ao sistema.",
        employee: newEmployee,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async removeEmployeeData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      const employeeToBeRemoved = {
        where: {
          employee_id: uuid as string,
        },
      };

      await prisma.employee.delete(employeeToBeRemoved);

      return res
        .status(200)
        .json({ message: "Funcionário removido do sistema." });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async updateEmployeeData(req: Request, res: Response): Promise<Response> {
    try {
      const updateEmployeeValues = req.body;
      const { uuid } = req.params;

      const employeeToBeUpdated = {
        where: {
          employee_id: uuid as string,
        },
        data: updateEmployeeValues,
      };

      const updatedEmployee: IEmployee = await prisma.employee.update(
        employeeToBeUpdated
      );

      return res.status(200).json({
        message: "Dados do funcionário atualizados.",
        udpate: updatedEmployee,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }
}

export default EmployeeController;