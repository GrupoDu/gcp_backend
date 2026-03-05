import type {
  Decimal,
  InputJsonValue,
  JsonValue,
} from "@prisma/client/runtime/wasm-compiler-edge";

export interface IProduct {
  uuid: string;
  name: string;
  description: string;
  product_type: string;
  created_at: Date;
  image: string;
  features?: string[];
  acronym?: string | null;
  composition?: JsonValue;
  stock_quantity?: Decimal;
}

export interface IProductCreate extends Omit<IProduct, "composition"> {
  composition?: InputJsonValue;
}

export interface IProductUpdate extends Partial<
  Omit<IProduct, "composition" | "uuid" | "created_at">
> {
  composition?: InputJsonValue;
}
