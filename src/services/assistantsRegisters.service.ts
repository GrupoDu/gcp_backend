import type {
  IAssistantsRegisterIdentifiers,
  IAssistantsRegister,
  IAssistantsRegisterCreate,
} from "../types/assistantsRegisters.interface";
import type { PrismaClient } from "../../generated/prisma/client.js";

/**
 * Service responsável por gerenciar registros de assistentes.
 */
export default class AssistantsPoRegistersService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Método responsável por buscar todos os registros de assistentes.
   */
  async getAllAssistantsPORegisters(): Promise<IAssistantsRegister[]> {
    return this._prisma.assistants_register.findMany();
  }

  /**
   * Método responsável por buscas registro de assistentes por ID do assistente
   */
  async getAssistantsPORegistersByAssistantId(
    assistant_uuid: string,
  ): Promise<IAssistantsRegister[]> {
    return this._prisma.assistants_register.findMany({
      where: {
        assistant_uuid,
      },
    });
  }

  /**
   * Cria registro de assistente
   */
  async createAssistantPORegister(
    newAssistantPORegisterValues: IAssistantsRegisterCreate,
  ): Promise<IAssistantsRegister> {
    return this._prisma.assistants_register.create({
      data: {
        ...newAssistantPORegisterValues,
        is_delivered: false,
      },
    });
  }

  /**
   * Atualizar o registro de assistente como entregue
   */
  async updateAssistantPORegisterAsDelivered(
    identifiers: IAssistantsRegisterIdentifiers,
  ): Promise<string> {
    await this._prisma.assistants_register.updateMany({
      where: {
        assistant_uuid: identifiers.assistant_uuid,
        assistant_as: identifiers.assistant_as,
      },
      data: {
        is_delivered: true,
        delivered_at: new Date(),
      },
    });

    return "Produção de assistente salva ao registro.";
  }

  /**
   * Verifica se todos os registros de um assistente estão entregues (Exemplo simplificado)
   */
  async hasAssistantDoneEverything(assistant_uuid: string): Promise<boolean> {
    const registers = await this._prisma.assistants_register.findMany({
      where: {
        assistant_uuid,
      },
    });

    return registers.every((register) => register.is_delivered);
  }
}
