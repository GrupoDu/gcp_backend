import { randomUUID } from "node:crypto";
import type { IProductTestType } from "../../types/product.interface.js";

export const productFactory = (
  overrides: Partial<IProductTestType> = {},
): IProductTestType => ({
  product_uuid: randomUUID(),
  name: "Test Product",
  description: "Test product description",
  product_type: "material",
  created_at: new Date(),
  image: "test-image.jpg",
  features: ["feature1", "feature2"],
  acronym: "TP",
  composition: { material: "test" },
  stock_quantity: 50,
  ...overrides,
});
