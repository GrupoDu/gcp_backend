import type { Decimal } from "../../generated/prisma/internal/prismaNamespace.js";

export interface IAnualAnalysis {
  id: string;
  month: Decimal;
  year: Decimal;
  delivered: Decimal;
  not_delivered: Decimal;
}
