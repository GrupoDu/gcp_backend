export interface IBilling {
  billing_uuid: string;
  created_at: Date;
  client_uuid: string;
  billing_address: string;
  name?: string | null;
}

export interface IBillingCreate {
  client_uuid: string;
  billing_address: string;
  name?: string;
}

export interface IBillingUpdate {
  client_uuid?: string;
  billing_address?: string;
  name?: string;
}
