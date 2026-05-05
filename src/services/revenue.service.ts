import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IRevenue,
  IRevenueCreate,
  IRevenueUpdate,
} from "../types/revenue.interface.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

/**
 * Service responsável por gerenciar receitas (dados fiscais).
 *
 * @class RevenueService
 */
export default class RevenueService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todos os registros de receita
   *
   * @returns {Promise<IRevenue[]>}
   */
  async getAllRevenues(): Promise<IRevenue[]> {
    return this._prisma.revenues.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Busca uma receita pelo ID
   *
   * @param {string} revenue_uuid - ID
   * @returns {Promise<IRevenue>}
   */
  async getRevenueById(revenue_uuid: string): Promise<IRevenue> {
    const revenue = await this._prisma.revenues.findUnique({
      where: { revenue_uuid },
    });

    if (!revenue) throw new Error("Receita não encontrada");

    return revenue;
  }

  /**
   * Cria uma nova receita
   *
   * @param {IRevenueCreate} data - Dados
   * @returns {Promise<IRevenue>}
   */
  async createRevenue(data: IRevenueCreate): Promise<IRevenue> {
    return this._prisma.revenues.create({
      data,
    });
  }

  /**
   * Atualiza uma receita
   *
   * @param {string} revenue_uuid - ID
   * @param {IRevenueUpdate} data - Dados
   * @returns {Promise<IRevenue>}
   */
  async updateRevenue(
    revenue_uuid: string,
    data: IRevenueUpdate,
  ): Promise<IRevenue> {
    const updateFields = removeUndefinedUpdateFields(data);

    if (Object.keys(updateFields).length === 0) {
      return this.getRevenueById(revenue_uuid);
    }

    return this._prisma.revenues.update({
      where: { revenue_uuid },
      data: updateFields,
    });
  }
}
