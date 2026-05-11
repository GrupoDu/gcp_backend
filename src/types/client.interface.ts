export interface IClient {
  client_uuid: string;
  created_at: Date;
  client_name: string;
  client_cnpj: string;
  client_address: string;
  client_phone: string;
  client_landline?: string;
}

export interface IClientCreate extends Omit<
  IClient,
  "client_uuid" | "created_at"
> {}

export interface IClientUpdate extends Partial<IClientCreate> {}
