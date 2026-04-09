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
   * @param {string} employeeUuid - ID de funcionário
   * @returns {Promise<IEmployee>} Dados do funcionário
   * @see {IEmployee}
   */
  async getEmployeeDataById(employeeUuid: string): Promise<IEmployee> {
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
   * @param {string} employeeUuid - ID do funcionário
   * @returns {Promise<IEmployee>} - Dados do funcionário atualizados
   * @see {IEmployee}
   * @see {IEmployeeUpdate}
   */
  async updateEmployeeData(
    employeeNewData: IEmployeeUpdate,
    employeeUuid: string,
  ): Promise<IEmployee> {
    const updateFields = removeUndefinedUpdateFields(employeeNewData);

    return this._prisma.employees.update({
      where: {
        employee_id: employeeUuid,
      },
      data: updateFields,
    });
  }

  /**
   * Remove funcionário do sistema
   *
   * @param {string} employeeUuid - ID do funcionário
   * @returns {Promise<string>} - Mensagem de funcionário removido do sistema
   */
  async removeEmployeeData(employeeUuid: string): Promise<string> {
    if (!employeeUuid) throw new Error(responseMessages.fillAllFieldMessage);

    await this._prisma.employees.delete({
      where: {
        employee_id: employeeUuid,
      },
    });

    return "Funcionário removido do sistema.";
  }

  /**
   * Incrementa quantidade de atividades entregues do funcionário
   *
   * @param {string} employeeUuid - ID do funcionário
   * @returns {Promise<IEmployee>} - Funcionário com atividade incrementada
   * @see {IEmployee}
   */
  async incrementEmployeeActivitiesQuantity(
    employeeUuid: string,
  ): Promise<IEmployee> {
    return this._prisma.employees.update({
      where: {
        employee_id: employeeUuid,
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
   * @param {string} employeeUuid - ID do funcionário
   * @param {number} productProducedQuantity - Quantidade de produtos produzidos
   * @returns {Promise<IEmployee>} - Funcionário com quantidade de produtos produzidos incrementada
   * @see {IEmployee}
   */
  async incrementEmployeeProductsProducedQuantity(
    employeeUuid: string,
    productProducedQuantity: number,
  ): Promise<IEmployee> {
    return this._prisma.employees.update({
      where: {
        employee_id: employeeUuid,
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
