export interface IDelivery {
  delivery_uuid: string;
  created_at: Date;
  building: string;
  delivery_address: string;
  reference?: string | null;
  delivery_observation?: string | null;
}

export interface IDeliveryCreate extends Omit<
  IDelivery,
  "created_at" | "delivery_uuid"
> {}

export interface IDeliveryUpdate extends Partial<IDeliveryCreate> {}
