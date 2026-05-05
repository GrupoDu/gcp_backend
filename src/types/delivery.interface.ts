export interface IDelivery {
  delivery_uuid: string;
  created_at: Date;
  order_uuid: string;
  building: string;
  delivery_address: string;
  reference?: string | null;
  delivery_observation?: string | null;
}

export interface IDeliveryCreate {
  order_uuid: string;
  building: string;
  delivery_address: string;
  reference?: string;
  delivery_observation?: string;
}

export interface IDeliveryUpdate {
  order_uuid?: string;
  building?: string;
  delivery_address?: string;
  reference?: string;
  delivery_observation?: string;
}
