import type { PrismaClient } from "@prisma/client";
import type {
  IEmployee,
  IEmployeeResponse,
} from "../types/employee.interface.js";
import { responseMessages } from "../constants/messages.constants.js";

class EmployeeService {
  constructor(private prisma: PrismaClient) {}

  async getAllEmployeesData(): Promise<IEmployeeResponse[]> {
    const allEmployeesData: IEmployeeResponse[] =
      await this.prisma.employee.findMany();

    if (!allEmployeesData) {
      throw new Error("Nenhum funcionário encontrado.");
    }

    return allEmployeesData;
  }

  async registerNewEmployee(
    employeeData: IEmployee,
  ): Promise<IEmployeeResponse> {
    if (!employeeData) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const newEmployee: IEmployeeResponse = await this.prisma.employee.create({
      data: employeeData,
    });

    return newEmployee;
  }

  async updateEmployeeData(
    employeeNewData: IEmployee,
    employeeUuid: string,
  ): Promise<IEmployeeResponse> {
    if (!employeeNewData || !employeeUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updatedEmployee: IEmployeeResponse =
      await this.prisma.employee.update({
        where: {
          employee_id: employeeUuid as string,
        },
        data: employeeNewData,
      });

    return updatedEmployee;
  }

  async removeEmployeeData(employeeUuid: string): Promise<string> {
    if (!employeeUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    await this.prisma.employee.delete({
      where: {
        employee_id: employeeUuid,
      },
    });

    return "Funcionário removido do sistema.";
  }
}

export default EmployeeService;
