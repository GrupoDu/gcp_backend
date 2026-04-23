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
 *
 * @class {EmployeeService}
 * @see EmployeeController
 */
class EmployeeService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Cliente do prisma */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Procura todos os funcionários
   *
   * @returns {Promise<IEmployee[]>} Array de funcionários
   * @see {IEmployee}
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
   *
   * @param {string} employee_uuid - ID de funcionário
   * @returns {Promise<IEmployee>} Dados do funcionário
   * @see {IEmployee}
   */
  async getEmployeeDataById(employee_uuid: string): Promise<IEmployee> {
    const employeeData: IEmployee | null =
      await this._prisma.employees.findUnique({
        where: {
          employee_uuid,
        },
        select: {
          employee_uuid: true,
          name: true,
          employee_role: true,
          delivered_activities_quantity: true,
          not_delivered_activities_quantity: true,
          produced_quantity: true,
        },
      });

    if (!employeeData) throw new Error("Usuário não encontrado.");

    return employeeData;
  }

  /**
   * Registra um funcionário
   *
   * @param {IEmployeeCreate} employeeData - Dados do novo funcionário
   * @returns {Promise<IEmployee>} Novo funcionário
   * @see {IEmployeeCreate}
   */
  async registerNewEmployee(employeeData: IEmployeeCreate): Promise<IEmployee> {
    return this._prisma.employees.create({
      data: employeeData,
    });
  }

  /**
   * Atualiza dados de um funcionário
   *
   * @param {IEmployeeUpdate} employeeNewData - Dados atualizados do funcionário
   * @param {string} employee_uuid - ID do funcionário
   * @returns {Promise<IEmployee>} - Dados do funcionário atualizados
   * @see {IEmployee}
   * @see {IEmployeeUpdate}
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
   *
   * @param {string} employee_uuid - ID do funcionário
   * @returns {Promise<string>} - Mensagem de funcionário removido do sistema
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
   *
   * @param {string} employee_uuid - ID do funcionário
   * @returns {Promise<IEmployee>} - Funcionário com atividade incrementada
   * @see {IEmployee}
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
   *
   * @param {string} employee_uuid - ID do funcionário
   * @param {number} productProducedQuantity - Quantidade de produtos produzidos
   * @returns {Promise<IEmployee>} - Funcionário com quantidade de produtos produzidos incrementada
   * @see {IEmployee}
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
