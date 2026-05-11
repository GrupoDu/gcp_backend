import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IBilling,
  IBillingCreate,
  IBillingUpdate,
} from "../types/billing.interface.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

/**
 * Service responsável por gerenciar faturamento.
 */
export default class BillingService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todos os faturamentos
   */
  async getAllBillings(): Promise<IBilling[]> {
    return this._prisma.billings.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  /**
   * Busca um faturamento pelo ID
   */
  async getBillingById(billing_uuid: string): Promise<IBilling> {
    const billing = await this._prisma.billings.findUnique({
      where: { billing_uuid },
    });

    if (!billing) throw new Error("Faturamento não encontrado");

    return billing;
  }

  /**
   * Cria um novo faturamento
   */
  async createBilling(data: IBillingCreate): Promise<IBilling> {
    return this._prisma.billings.create({
      data,
    });
  }

  /**
   * Atualiza um faturamento
   */
  async updateBilling(
    billing_uuid: string,
    data: IBillingUpdate,
  ): Promise<IBilling> {
    const updateFields = removeUndefinedUpdateFields(data);

    if (Object.keys(updateFields).length === 0) {
      return this.getBillingById(billing_uuid);
    }

    return this._prisma.billings.update({
      where: { billing_uuid },
      data: updateFields,
    });
  }
}
