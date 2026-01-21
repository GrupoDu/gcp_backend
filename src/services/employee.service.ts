import type { PrismaClient } from "@prisma/client";
import type {
  IEmployee,
  IEmployeeCreate,
  IEmployeeUpdate,
} from "../types/employee.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import verifyFieldstoUpdate from "../utils/verifyFieldsToUpdate.utils.js";

class EmployeeService {
  constructor(private prisma: PrismaClient) {}

  async getAllEmployeesData(): Promise<IEmployee[]> {
    const allEmployeesData: IEmployee[] = await this.prisma.employee.findMany();

    if (!allEmployeesData) {
      throw new Error("Nenhum funcionário encontrado.");
    }

    return allEmployeesData;
  }

  async registerNewEmployee(employeeData: IEmployeeCreate): Promise<IEmployee> {
    if (!employeeData) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const newEmployee: IEmployee = await this.prisma.employee.create({
      data: employeeData,
    });

    return newEmployee;
  }

  async updateEmployeeData(
    employeeNewData: IEmployeeUpdate,
    employeeUuid: string,
  ): Promise<IEmployee> {
    if (!employeeUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updateFields = verifyFieldstoUpdate(employeeNewData);

    if (updateFields.length < 1) throw new Error("Nenhum campo fornecido.");

    const updatedEmployee: IEmployee = await this.prisma.employee.update({
      where: {
        employee_id: employeeUuid as string,
      },
      data: updateFields,
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
