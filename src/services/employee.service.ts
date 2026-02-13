import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IEmployee,
  IEmployeeCreate,
  IEmployeeUpdate,
} from "../types/employee.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

class EmployeeService {
  constructor(private prisma: PrismaClient) {}

  async getAllEmployeesData(): Promise<IEmployee[]> {
    const allEmployeesData: IEmployee[] =
      await this.prisma.employees.findMany();

    if (!allEmployeesData) {
      throw new Error("Nenhum funcionário encontrado.");
    }

    return allEmployeesData;
  }

  async getEmployeeData(employeeUuid: string): Promise<IEmployee> {
    const employeeData: IEmployee | null =
      await this.prisma.employees.findUnique({
        where: {
          employee_id: employeeUuid,
        },
        select: {
          employee_id: true,
          name: true,
          employee_type: true,
          delivered_activities_quantity: true,
          not_delivered_activities_quantity: true,
          products_produced_quantity: true,
        },
      });

    if (!employeeData) throw new Error("Usuário não encontrado.");

    return employeeData;
  }

  async registerNewEmployee(employeeData: IEmployeeCreate): Promise<IEmployee> {
    if (!employeeData) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const newEmployee: IEmployee = await this.prisma.employees.create({
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

    const updateFields = removeUndefinedUpdateFields(employeeNewData);

    if (updateFields.length < 1) throw new Error("Nenhum campo fornecido.");

    const updatedEmployee: IEmployee = await this.prisma.employees.update({
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

    await this.prisma.employees.delete({
      where: {
        employee_id: employeeUuid,
      },
    });

    return "Funcionário removido do sistema.";
  }

  async incrementEmployeeActivitiesQuantity(
    employeeUuid: string,
  ): Promise<IEmployee> {
    const updatedEmployee: IEmployee = await this.prisma.employees.update({
      where: {
        employee_id: employeeUuid as string,
      },
      data: {
        delivered_activities_quantity: {
          increment: 1,
        },
      },
    });

    return updatedEmployee;
  }

  async incrementEmployeeProductsProducedQuantity(
    employeeUuid: string,
    productProducedQuantity: number,
  ): Promise<IEmployee> {
    if (!productProducedQuantity) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updatedEmployee: IEmployee = await this.prisma.employees.update({
      where: {
        employee_id: employeeUuid as string,
      },
      data: {
        products_produced_quantity: {
          increment: productProducedQuantity as number,
        },
      },
    });

    return updatedEmployee;
  }
}

export default EmployeeService;
