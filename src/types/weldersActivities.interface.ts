export interface IWeldersActivities {
  welder_activity_uuid: string;
  registered_at: Date;
  produced_quantity: number;
  welder_uuid: string;
  product_uuid: string;
}

export interface ICreateWeldersActivities extends Omit<
  IWeldersActivities,
  "welder_activity_uuid"
> {}

export interface IUpdateWeldersActivities extends Partial<ICreateWeldersActivities> {}
