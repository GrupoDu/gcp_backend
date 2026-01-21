import type { IGoalUpdate } from "../types/goal.interface.js";
import type { IProductUpdate } from "../types/product.interface.js";

function verifyFieldstoUpdate(productNewData: IProductUpdate | IGoalUpdate) {
  const clearFields = Object.fromEntries(
    Object.entries(productNewData).filter(([_, value]) => value !== undefined),
  );

  return clearFields;
}

export default verifyFieldstoUpdate;
