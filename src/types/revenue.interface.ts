export interface IRevenue {
  revenue_uuid: string;
  created_at: Date;
  revenue_address: string;
  revenue_cnpj: string;
  revenue_landline?: string | null;
  revenue_phone: string;
  revenue_email: string;
  client_uuid: string;
}

export interface IRevenueCreate extends Omit<
  IRevenue,
  "revenue_uuid" | "created_at"
> {}

export interface IRevenueUpdate extends Partial<IRevenueCreate> {}
