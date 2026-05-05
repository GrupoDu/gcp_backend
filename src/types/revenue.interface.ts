export interface IRevenue {
  revenue_uuid: string;
  created_at: Date;
  client_uuid: string;
  revenue_address: string;
  revenue_cnpj: string;
  revenue_landline: string;
  revenue_phone: string;
  revenue_email: string;
}

export interface IRevenueCreate {
  client_uuid: string;
  revenue_address: string;
  revenue_cnpj: string;
  revenue_landline: string;
  revenue_phone: string;
  revenue_email: string;
}

export interface IRevenueUpdate {
  client_uuid?: string;
  revenue_address?: string;
  revenue_cnpj?: string;
  revenue_landline?: string;
  revenue_phone?: string;
  revenue_email?: string;
}
