import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IClient,
  IClientCreate,
  IClientUpdate,
} from "../types/client.interface.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

/**
 * Service responsável por gerenciar clientes.
 */
export default class ClientService {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  private readonly _includeData = {
    billings: true,
    revenues: true,
  };

  /**
   * Busca todos os clientes
   */
  async getAllClients(): Promise<IClient[]> {
    return this._prisma.clients.findMany({
      include: this._includeData,
      orderBy: { client_name: "asc" },
    }) as unknown as Promise<IClient[]>;
  }

  /**
   * Busca um cliente por UUID
   */
  async getClientById(client_uuid: string): Promise<IClient> {
    const client = await this._prisma.clients.findUnique({
      where: { client_uuid },
      include: this._includeData,
    });

    if (!client) throw new Error("Cliente não encontrado");

    return client as unknown as Promise<IClient>;
  }

  /**
   * Cria um novo cliente
   */
  async createClient(data: IClientCreate): Promise<IClient> {
    return this._prisma.clients.create({
      data,
      include: this._includeData,
    }) as unknown as Promise<IClient>;
  }

  /**
   * Atualiza dados de um cliente
   */
  async updateClient(
    client_uuid: string,
    data: IClientUpdate,
  ): Promise<IClient> {
    const updateFields = removeUndefinedUpdateFields(data);

    if (Object.keys(updateFields).length === 0) {
      return this.getClientById(client_uuid);
    }

    return this._prisma.clients.update({
      where: { client_uuid },
      data: updateFields,
      include: this._includeData,
    }) as unknown as Promise<IClient>;
  }
}
