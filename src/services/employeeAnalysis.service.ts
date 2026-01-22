import type { PrismaClient } from "@prisma/client";
import type { IEmployeeProductionAnalysis } from "../types/dataAnalysis.interface.js";
import type { IRegister } from "../types/register.interface.js";

class EmployeeAnalysisService {
  constructor(private prisma: PrismaClient) {}

  private getTodayDate(): Date {
    return new Date();
  }

  async employeeActivityAnalysis(employee_id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        employee_id: employee_id,
      },
    });

    if (!employee) throw new Error("Funcionário não encontrado.");

    const employeeDeliveredRegisters: number =
      await this.getEmployeeDeliveredRegistersQuantity(employee_id);

    const employeeNotDeliveredRegisters: number =
      await this.getEmployeeNotDeliveredRegistersQuantity(employee_id);

    const employeeFullAnalysis: IEmployeeProductionAnalysis = {
      deliveredRegisterQuantity: employeeDeliveredRegisters,
      notDeliveredRegisterQuantity: employeeNotDeliveredRegisters,
      employeeName: employee.name,
    };

    return employeeFullAnalysis;
  }

  private async getEmployeeDeliveredRegistersQuantity(
    employee_id: string,
  ): Promise<number> {
    const employeeDeliveredRegisters: IRegister[] =
      await this.getEmployeeRegisterData(employee_id, "Entregue");

    return employeeDeliveredRegisters.length;
  }

  private async getEmployeeNotDeliveredRegistersQuantity(
    employee_id: string,
  ): Promise<number> {
    const employeeNotDeliveredRegisters: IRegister[] =
      await this.getEmployeeRegisterData(employee_id, "Nao entregue");

    return employeeNotDeliveredRegisters.length;
  }

  private async getEmployeeRegisterData(
    employee_id: string,
    status: string,
  ): Promise<IRegister[]> {
    const registerData: IRegister[] = await this.prisma.register.findMany({
      where: {
        employee_uuid: employee_id,
        status: status,
        deadline: {
          gte: new Date(
            this.getTodayDate().getFullYear(),
            this.getTodayDate().getMonth(),
          ),
          lt: new Date(
            this.getTodayDate().getFullYear(),
            this.getTodayDate().getMonth() + 1,
          ),
        },
      },
    });

    if (!registerData)
      throw new Error(
        `Nenhum registro de status ${status} encontrado para o funcionário nesse mês.`,
      );

    return registerData;
  }
}

export default EmployeeAnalysisService;
