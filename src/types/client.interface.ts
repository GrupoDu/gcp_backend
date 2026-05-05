import type { IBilling } from "./billing.interface.js";
import type { IRevenue } from "./revenue.interface.js";

export interface IClient {
  client_uuid: string;
  created_at: Date;
  client_name: string;
  client_cnpj: string;
  client_address: string;
  client_phone: string;
  client_landline?: string;
  billings?: IBilling[];
  revenues?: IRevenue[];
}

export interface IClientCreate {
  client_name: string;
  client_cnpj: string;
  client_address: string;
  client_phone: string;
  client_landline?: string;
}

export interface IClientUpdate {
  client_name?: string;
  client_cnpj?: string;
  client_address?: string;
  client_landline?: string;
  client_phone?: string;
}
