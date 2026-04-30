import type {
  InputJsonValue,
  JsonValue,
} from "@prisma/client/runtime/wasm-compiler-edge";

export interface IProduct {
  product_uuid: string;
  name: string;
  description?: string | null;
  product_type: string;
  created_at: Date;
  image: string;
  stock_quantity: number;
  unit_price: number;
  features?: string[];
  acronym?: string | null;
  composition?: JsonValue;
}

/**
 * @extends {IProduct}
 * @see {IProduct}
 * @Omit composition, created_at, uuid
 */
export interface IProductCreate extends Omit<
  IProduct,
  "composition" | "created_at" | "product_uuid"
> {
  composition?: InputJsonValue;
}

/**
 * @see {IProduct}
 * @extends {IProduct}
 * @Omit composition, uuid, created_at
 */
export interface IProductUpdate extends Partial<
  Omit<IProduct, "composition" | "product_uuid" | "created_at">
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
