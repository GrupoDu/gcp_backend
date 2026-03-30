import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IEmployee,
  IEmployeeCreate,
  IEmployeeUpdate,
} from "../types/employee.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

/**
 * Service de gestão de dados de empregados.
 * @see EmployeeController
 * @method getAllEmployeesData
 * @method getEmployeeDataById
 */
class EmployeeService {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async getAllEmployeesData(): Promise<IEmployee[]> {
    const allEmployeesData: IEmployee[] = await this._prisma.employees.findMany(
      {
        orderBy: {
          name: "asc",
        },
      },
    );

    if (!allEmployeesData) throw new Error("Nenhum funcionário encontrado.");

    return allEmployeesData;
  }

  async getEmployeeDataById(employeeUuid: string): Promise<IEmployee> {
    if (!employeeUuid) {
      throw new Error("ID do funcionário nao fornecido.");
    }

    const employeeData: IEmployee | null =
      await this._prisma.employees.findUnique({
        where: {
          employee_id: employeeUuid,
        },
        select: {
          employee_id: true,
          name: true,
          employee_type: true,
          delivered_activities_quantity: true,
          not_delivered_activities_quantity: true,
          produced_quantity: true,
        },
      });

    if (!employeeData) throw new Error("Usuário não encontrado.");

    return employeeData;
  }

  async registerNewEmployee(employeeData: IEmployeeCreate): Promise<IEmployee> {
    if (!employeeData) throw new Error(responseMessages.fillAllFieldMessage);

    const newEmployee: IEmployee = await this._prisma.employees.create({
      data: employeeData,
    });

    return newEmployee;
  }

  async updateEmployeeData(
    employeeNewData: IEmployeeUpdate,
    employeeUuid: string,
  ): Promise<IEmployee> {
    if (!employeeUuid) throw new Error(responseMessages.fillAllFieldMessage);

    const updateFields = removeUndefinedUpdateFields(employeeNewData);

    if (updateFields.length < 1) throw new Error("Nenhum campo fornecido.");

    const updatedEmployee: IEmployee = await this._prisma.employees.update({
      where: {
        employee_id: employeeUuid,
      },
      data: updateFields,
    });

    return updatedEmployee;
  }

  async removeEmployeeData(employeeUuid: string): Promise<string> {
    if (!employeeUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    await this._prisma.employees.delete({
      where: {
        employee_id: employeeUuid,
      },
    });

    return "Funcionário removido do sistema.";
  }

  async incrementEmployeeActivitiesQuantity(
    employeeUuid: string,
  ): Promise<IEmployee> {
    if (!employeeUuid) throw new Error("ID do funcionário não fornecido.");

    const updatedEmployee: IEmployee = await this._prisma.employees.update({
      where: {
        employee_id: employeeUuid,
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
    if (!employeeUuid) throw new Error("ID do funcionário não fornecido.");

    if (!productProducedQuantity)
      throw new Error(responseMessages.fillAllFieldMessage);

    const updatedEmployee: IEmployee = await this._prisma.employees.update({
      where: {
        employee_id: employeeUuid,
      },
      data: {
        produced_quantity: {
          increment: productProducedQuantity,
        },
      },
    });

    return updatedEmployee;
  }
}

export default EmployeeService;
