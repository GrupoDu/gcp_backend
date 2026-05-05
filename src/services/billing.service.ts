import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IBilling,
  IBillingCreate,
  IBillingUpdate,
} from "../types/billing.interface.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

/**
 * Service responsável por gerenciar faturamento.
 *
 * @class BillingService
 */
export default class BillingService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todos os faturamentos
   *
   * @returns {Promise<IBilling[]>}
   */
  async getAllBillings(): Promise<IBilling[]> {
    return this._prisma.billing.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Busca um faturamento pelo ID
   *
   * @param {string} billing_uuid - ID do faturamento
   * @returns {Promise<IBilling>}
   */
  async getBillingById(billing_uuid: string): Promise<IBilling> {
    const billing = await this._prisma.billing.findUnique({
      where: { billing_uuid },
    });

    if (!billing) throw new Error("Faturamento não encontrado");

    return billing;
  }

  /**
   * Cria um novo faturamento
   *
   * @param {IBillingCreate} data - Dados do faturamento
   * @returns {Promise<IBilling>}
   */
  async createBilling(data: IBillingCreate): Promise<IBilling> {
    return this._prisma.billing.create({
      data,
    });
  }

  /**
   * Atualiza um faturamento
   *
   * @param {string} billing_uuid - ID
   * @param {IBillingUpdate} data - Dados para atualizar
   * @returns {Promise<IBilling>}
   */
  async updateBilling(
    billing_uuid: string,
    data: IBillingUpdate,
  ): Promise<IBilling> {
    const updateFields = removeUndefinedUpdateFields(data);

    if (Object.keys(updateFields).length === 0) {
      return this.getBillingById(billing_uuid);
    }

    return this._prisma.billing.update({
      where: { billing_uuid },
      data: updateFields,
    });
  }
}
