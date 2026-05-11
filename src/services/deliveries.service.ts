import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IDelivery,
  IDeliveryCreate,
  IDeliveryUpdate,
} from "../types/delivery.interface.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

/**
 * Service responsável por gerenciar entregas.
 *
 * @class DeliveriesService
 */
export default class DeliveriesService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todas as entregas
   *
   * @returns {Promise<IDelivery[]>}
   */
  async getAllDeliveries(): Promise<IDelivery[]> {
    return this._prisma.deliveries.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Busca uma entrega pelo ID
   *
   * @param {string} delivery_uuid - ID
   * @returns {Promise<IDelivery>}
   */
  async getDeliveryById(delivery_uuid: string): Promise<IDelivery> {
    const delivery = await this._prisma.deliveries.findUnique({
      where: { delivery_uuid },
    });

    if (!delivery) throw new Error("Entrega não encontrada");

    return delivery;
  }

  /**
   * Cria uma nova entrega
   *
   * @param {IDeliveryCreate} data - Dados
   * @returns {Promise<IDelivery>}
   */
  async createDelivery(data: IDeliveryCreate): Promise<IDelivery> {
    return this._prisma.deliveries.create({
      data,
    });
  }

  /**
   * Atualiza uma entrega
   *
   * @param {string} delivery_uuid - ID
   * @param {IDeliveryUpdate} data - Dados
   * @returns {Promise<IDelivery>}
   */
  async updateDelivery(
    delivery_uuid: string,
    data: IDeliveryUpdate,
  ): Promise<IDelivery> {
    const updateFields = removeUndefinedUpdateFields(data);

    if (Object.keys(updateFields).length === 0) {
      return this.getDeliveryById(delivery_uuid);
    }

    return this._prisma.deliveries.update({
      where: { delivery_uuid },
      data: updateFields,
    });
  }
}
