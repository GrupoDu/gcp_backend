import type {
  IAssistantPORegisterIdentifiers,
  IAssistantsPORegisters,
  IAssistantsPORegisterCreate,
} from "../types/assistantsPoRegisters.interface.js";
import type { PrismaClient } from "../../generated/prisma/client.js";

export default class AssistantsPoRegistersService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllAssistantsPORegisters(): Promise<IAssistantsPORegisters[]> {
    return this.prisma.assistants_po_register.findMany();
  }

  async getAssistantsPORegistersByProductionOrderId(
    production_order_uuid: string,
  ): Promise<IAssistantsPORegisters[]> {
    const assistantPORegisterProductionOrder: IAssistantsPORegisters[] =
      await this.prisma.assistants_po_register.findMany({
        where: {
          production_order_uuid,
        },
      });

    return assistantPORegisterProductionOrder;
  }

  async createAssistantPORegister(
    newAssistantPORegisterValues: IAssistantsPORegisterCreate,
  ): Promise<IAssistantsPORegisters> {
    const newAssistantPORegister =
      await this.prisma.assistants_po_register.create({
        data: newAssistantPORegisterValues,
      });

    return newAssistantPORegister;
  }

  async updateAssistantPORegisterAsDelivered(
    identifiers: IAssistantPORegisterIdentifiers,
  ): Promise<string> {
    await this.prisma.assistants_po_register.updateMany({
      where: {
        assistant_uuid: identifiers.assistant_uuid,
        production_order_uuid: identifiers.production_order_uuid,
        assistant_as: identifiers.assistant_as,
      },
      data: {
        delivered: true,
        delivered_at: new Date(),
      },
    });

    return "Produção de assistente salva ao registro.";
  }

  async isEveryAssistantsPORegistersDone(production_order_id: string) {
    const assistantsPORegisters =
      await this.prisma.assistants_po_register.findMany({
        where: {
          production_order_uuid: production_order_id,
        },
      });

    return assistantsPORegisters.every((register) => register.delivered);
  }
}
