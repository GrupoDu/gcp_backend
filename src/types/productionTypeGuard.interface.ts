import type { register } from "@prisma/client";
import type { IRegister } from "./models.interface.js";

export function registerExists(register: IRegister[]): register is IRegister[] {
  return register !== undefined;
}
