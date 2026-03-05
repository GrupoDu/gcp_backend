import type { PrismaClient } from "../../generated/prisma/client.ts";
import type { IEmployeeProductionAnalysis } from "../types/dataAnalysis.interface.ts";
import { cacheInstance } from "../utils/cache.util.ts";
import type { IEmployee } from "../types/employee.interface.ts";
import { getMonthRange } from "../utils/getMonthRange.util.ts";
import { getTodayDate } from "../utils/getTodayDate.ts";

class EmployeeAnalysisService {
  private prisma: PrismaClient;  
  private readonly CACHE_TTL = 300;
  private readonly CACHE_PREFIX = "employee_analysis";

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async employeeActivityAnalysis(
    employee_id: string,
  ): Promise<IEmployeeProductionAnalysis> {
    const month = new Date().getMonth() + 1;
    const cacheKey = `${this.CACHE_PREFIX}:${employee_id}:${month}`;
    const dataAnalysis = this.getCachedData(cacheKey);

    if (dataAnalysis !== undefined) {
      console.log(`== USANDO CACHE: ${cacheKey} ==`);
      return dataAnalysis;
    }

    console.log("== CACHE EXPIRADO ==");
    console.log("== BUSCANDO NOVOS DADOS... =");
    const newDataAnalysis = await this.saveDataToCache(employee_id);

    return newDataAnalysis;
  }

  private getCachedData(
    cacheKey: string,
  ): IEmployeeProductionAnalysis | undefined {
    const cache = cacheInstance;

    const cachedData = cache.get<IEmployeeProductionAnalysis>(cacheKey);

    return cachedData;
  }

  private async saveDataToCache(
    employee_id: string,
  ): Promise<IEmployeeProductionAnalysis> {
    const month = new Date().getMonth() + 1;
    const cacheKey = `${this.CACHE_PREFIX}:${employee_id}:${month}`;
    const cache = cacheInstance;

    const employeeData: IEmployee = await this.getEmployeeData(employee_id);

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

    cache.set<IEmployeeProductionAnalysis>(
      cacheKey,
      fullEmployeeDataAnalysis,
      this.CACHE_TTL,
    );

    return fullEmployeeDataAnalysis;
  }

  private async getEmployeeDeliveredRegistersQuantity(
    employee_id: string,
  ): Promise<number> {
    const employeeDeliveredRegisters: number =
      await this.getEmployeeRegisterData(employee_id, "Entregue");

    return employeeDeliveredRegisters;
  }

  private async getEmployeeNotDeliveredRegistersQuantity(
    employee_id: string,
  ): Promise<number> {
    const employeeNotDeliveredRegisters: number =
      await this.getEmployeeRegisterData(employee_id, "Não entregue");

    return employeeNotDeliveredRegisters;
  }

  private async getEmployeeRegisterData(
    employee_id: string,
    status: string,
  ): Promise<number> {
    const employeeDeliveredRegisters: number =
      await this.prisma.production_order.count({
        where: {
          employee_uuid: employee_id,
          production_order_status: status,
          production_order_deadline: {
            gte: getMonthRange(getTodayDate()).actualMonth,
            lt: getMonthRange(getTodayDate()).nextMonth,
          },
        },
      });

    return employeeDeliveredRegisters;
  }

  private async getEmployeeData(employee_id: string): Promise<IEmployee> {
    const employeeData = await this.prisma.employees.findUnique({
      where: {
        employee_id: employee_id,
      },
    });

    if (!employeeData) throw new Error("Funcionário não encontrado.");

    return employeeData;
  }
}

export default EmployeeAnalysisService;
