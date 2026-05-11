import type { PrismaClient } from "../../generated/prisma/client.js";
import type { IEmployeeProductionAnalysis } from "../types/dataAnalysis.interface.js";
import { cacheInstance } from "../utils/cache.util.js";
import type { IEmployee } from "../types/employee.interface.js";
import { getMonthRange } from "../utils/getMonthRange.util.js";
import { getTodayDate } from "../utils/getTodayDate.js";
import debbugLogger from "../utils/debugLogger.js";
import EmployeeService from "./employee.service.js";

/**
 * Service para análise de dados de produção de um funcionário.
 */
class EmployeeAnalysisService {
  private _prisma: PrismaClient;
  private _employeeService: EmployeeService;
  private static readonly CACHE_TTL = 300;
  private static readonly CACHE_PREFIX = "employee_analysis";

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
    this._employeeService = new EmployeeService(prisma);
  }

  /**
   * Realiza a análise de dados de produção de um funcionário.
   */
  async employeeActivityAnalysis(
    employee_id: string,
  ): Promise<IEmployeeProductionAnalysis> {
    const month = new Date().getMonth() + 1;
    const cacheKey = `${EmployeeAnalysisService.CACHE_PREFIX}:${employee_id}:${month}`;
    const dataAnalysis = this.getCachedData(cacheKey);

    if (dataAnalysis !== undefined) {
      debbugLogger([`== USANDO CACHE: ${cacheKey} ==`]);
      return dataAnalysis;
    }

    debbugLogger(["== CACHE EXPIRADO ==", "== BUSCANDO NOVOS DADOS... ="]);
    return this.saveDataToCache(employee_id);
  }

  private getCachedData(
    cacheKey: string,
  ): IEmployeeProductionAnalysis | undefined {
    return cacheInstance.get<IEmployeeProductionAnalysis>(cacheKey);
  }

  private async saveDataToCache(
    employee_id: string,
  ): Promise<IEmployeeProductionAnalysis> {
    const month = new Date().getMonth() + 1;
    const cacheKey = `${EmployeeAnalysisService.CACHE_PREFIX}:${employee_id}:${month}`;
    const cache = cacheInstance;

    const employeeData: IEmployee =
      await this._employeeService.getEmployeeDataById(employee_id);

    const [delivered, notDelivered] = await Promise.all([
      this.getEmployeeDeliveredRegistersQuantity(employee_id),
      this.getEmployeeNotDeliveredRegistersQuantity(employee_id),
    ]);

    const fullEmployeeDataAnalysis: IEmployeeProductionAnalysis = {
      deliveredRegisterQuantity: delivered,
      notDeliveredRegisterQuantity: notDelivered,
      employeeName: employeeData.name,
      actualMonth: getMonthRange(getTodayDate()).actualMonth,
      nextMonth: getMonthRange(getTodayDate()).nextMonth,
    };

    cache.set(
      cacheKey,
      fullEmployeeDataAnalysis,
      EmployeeAnalysisService.CACHE_TTL,
    );

    return fullEmployeeDataAnalysis;
  }

  private async getEmployeeDeliveredRegistersQuantity(
    employee_id: string,
  ): Promise<number> {
    return this.getEmployeeRegisterData(employee_id, "Entregue");
  }

  private async getEmployeeNotDeliveredRegistersQuantity(
    employee_id: string,
  ): Promise<number> {
    return this.getEmployeeRegisterData(employee_id, "Não entregue");
  }

  private async getEmployeeRegisterData(
    employee_id: string,
    production_order_status: string,
  ): Promise<number> {
    return this._prisma.production_orders.count({
      where: {
        welder_uuid: employee_id,
        production_order_status,
        production_order_deadline: {
          gte: getMonthRange(getTodayDate()).actualMonth,
          lt: getMonthRange(getTodayDate()).nextMonth,
        },
      },
    });
  }
}

export default EmployeeAnalysisService;
