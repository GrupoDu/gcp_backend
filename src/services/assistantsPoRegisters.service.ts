import type {
  IAssistantPORegisterIdentifiers,
  IAssistantsPORegisters,
  IAssistantsPORegisterCreate,
} from "../types/assistantsPoRegisters.interface.js";
import type { PrismaClient } from "../../generated/prisma/client.js";

/**
 * Service responsável por gerenciar registros de assistentes.
 *
 * @class {AssistantsPoRegistersService}
 * @see AssistantsPoRegistersController
 */
export default class AssistantsPoRegistersService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Método responsável por buscar todos os registros de assistentes.
   *
   * @returns {Promise<IAssistantsPORegisters[]>} Array de registros de assistentes
   */
  async getAllAssistantsPORegisters(): Promise<IAssistantsPORegisters[]> {
    return this._prisma.assistants_po_register.findMany();
  }

  /**
   * Método responsável por buscas registro de assistentes por ID da ordem de produção
   *
   * @returns {Promise<IAssistantsPORegisters[]>} Array de registros de assistentes
   * @param {string} production_order_uuid - ID da ordem de produção
   */
  async getAssistantsPORegistersByProductionOrderId(
    production_order_uuid: string,
  ): Promise<IAssistantsPORegisters[]> {
    return this._prisma.assistants_po_register.findMany({
      where: {
        production_order_uuid,
      },
    });
  }

  /**
   * Método responsável por criar um novo registro de assistente
   *
   * @returns {Promise<IAssistantsPORegisters>} Novo registro de assistente
   * @param {IAssistantsPORegisterCreate} newAssistantPORegisterValues - Valores do novo registro de assistente
   * @see {IAssistantsPORegisterCreate}
   */
  async createAssistantPORegister(
    newAssistantPORegisterValues: IAssistantsPORegisterCreate,
  ): Promise<IAssistantsPORegisters> {
    return this._prisma.assistants_po_register.create({
      data: {
        ...newAssistantPORegisterValues,
        delivered: false,
      },
    });
  }

  /**
   * Método responsável por atualizar o registro de assistente como entregue
   *
   * @returns {Promise<string>} Mensagem de sucesso
   * @param {IAssistantPORegisterIdentifiers} identifiers - Identificadores para atualizar o registro
   * @see {IAssistantPORegisterIdentifiers}
   */
  async updateAssistantPORegisterAsDelivered(
    identifiers: IAssistantPORegisterIdentifiers,
  ): Promise<string> {
    await this._prisma.assistants_po_register.updateMany({
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

  /**
   * Método responsável por verificar se todos os assistentes entregaram suas tarefas
   *
   * @returns {Promise<boolean>} - Resultado boleano da verificação
   * @param {string} production_order_id - ID da ordem de produção
   */
  async hasEveryAssistantPORegistersDone(production_order_id: string) {
    const assistantsPORegisters =
      await this._prisma.assistants_po_register.findMany({
        where: {
          production_order_uuid: production_order_id,
        },
      });

    return assistantsPORegisters.every((register) => register.delivered);
  }
}
