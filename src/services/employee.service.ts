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
 */
class EmployeeService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Cliente do prisma */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Procura todos os funcionários
   */
  async getAllEmployeesData(): Promise<IEmployee[]> {
    return this._prisma.employees.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Procura um funcionário pelo ID
   */
  async getEmployeeDataById(employee_uuid: string): Promise<IEmployee> {
    const employeeData =
      await this._prisma.employees.findUnique({
        where: {
          employee_uuid,
        },
      });

    if (!employeeData) throw new Error("Usuário não encontrado.");

    return employeeData;
  }

  /**
   * Registra um funcionário
   */
  async registerNewEmployee(employeeData: IEmployeeCreate): Promise<IEmployee> {
    return this._prisma.employees.create({
      data: employeeData,
    });
  }

  /**
   * Atualiza dados de um funcionário
   */
  async updateEmployeeData(
    employeeNewData: IEmployeeUpdate,
    employee_uuid: string,
  ): Promise<IEmployee> {
    const updateFields = removeUndefinedUpdateFields(employeeNewData);

    return this._prisma.employees.update({
      where: {
        employee_uuid,
      },
      data: updateFields,
    });
  }

  /**
   * Remove funcionário do sistema
   */
  async removeEmployeeData(employee_uuid: string): Promise<string> {
    if (!employee_uuid) throw new Error(responseMessages.fillAllFieldMessage);

    await this._prisma.employees.delete({
      where: {
        employee_uuid,
      },
    });

    return "Funcionário removido do sistema.";
  }

  /**
   * Incrementa quantidade de atividades entregues do funcionário
   */
  async incrementEmployeeActivitiesQuantity(
    employee_uuid: string,
  ): Promise<IEmployee> {
    return this._prisma.employees.update({
      where: {
        employee_uuid,
      },
      data: {
        delivered_activities_quantity: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Incrementa quantidade de produtos produzidos do funcionário
   */
  async incrementEmployeeProductsProducedQuantity(
    employee_uuid: string,
    productProducedQuantity: number,
  ): Promise<IEmployee> {
    return this._prisma.employees.update({
      where: {
        employee_uuid,
      },
      data: {
        produced_quantity: {
          increment: productProducedQuantity,
        },
      },
    });
  }
}

export default EmployeeService;
