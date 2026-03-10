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

  async getAllAssistantsPoRegisters(): Promise<IAssistantsPORegisters[]> {
    return this.prisma.assitants_po_register.findMany();
  }

  async createAssistantPORegister(
    newAssistantPORegisterValues: IAssistantsPORegisterCreate,
  ): Promise<IAssistantsPORegisters> {
    const newAssistantPORegister =
      await this.prisma.assitants_po_register.create({
        data: newAssistantPORegisterValues,
      });

    return newAssistantPORegister;
  }

  async updateAssistantPORegisterAsDelivered(
    identifiers: IAssistantPORegisterIdentifiers,
  ): Promise<string> {
    await this.prisma.assitants_po_register.updateMany({
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
}
