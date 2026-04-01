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

/**
 * @extends {IProduct}
 * @see {IProduct}
 * @Omit composition, created_at, uuid
 */
export interface IProductCreate extends Omit<
  IProduct,
  "composition" | "created_at" | "uuid"
> {
  composition?: InputJsonValue;
}

/**
 * @see {IProduct}
 * @extends {IProduct}
 * @Omit composition, uuid, created_at
 */
export interface IProductUpdate extends Partial<
  Omit<IProduct, "composition" | "uuid" | "created_at">
> {
  composition?: InputJsonValue;
}

/**
 * @extends {IProduct}
 * @see {IProduct}
 * @Omit stock_quantity, composition
 */
export interface IProductTestType extends Omit<
  IProduct,
  "stock_quantity" | "composition"
> {
  stock_quantity: number;
  composition?: unknown;
}
