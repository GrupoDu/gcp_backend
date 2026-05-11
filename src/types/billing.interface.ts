export interface IBilling {
  billing_uuid: string;
  created_at: Date;
  billing_address: string;
  client_uuid: string;
  name?: string | null;
}

export interface IBillingCreate extends Omit<
  IBilling,
  "billing_uuid" | "created_at"
> {}

export interface IBillingUpdate extends Omit<Partial<IBilling>, "created_at"> {}
