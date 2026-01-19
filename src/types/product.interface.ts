import type { Prisma } from "@prisma/client";

interface IProduct {
  name: string;
  description: string;
  product_type: string;
  image: string;
  features?: string[];
  acronym?: string | null;
  composition?: Prisma.JsonValue;
}

export interface IProductCreate extends Omit<IProduct, "composition"> {
  composition?: Prisma.InputJsonValue;
}

export interface IProductUpdate extends Partial<IProduct> {
  uuid: string;
}

export interface IProductResponse extends IProduct {
  uuid: string;
  created_at: Date;
}
