import type { IUser } from "./models.interface.js";

export interface IUserValidation {
  success: boolean;
  user?: IUser;
  error?: {
    message: string;
    statusCode: number;
  };
}

export function successfulValidation(
  validation: IUserValidation
): validation is IUserValidation & { success: true; user: IUser } {
  return validation.success === true && validation.user !== undefined;
}

export function hasValidPassword(
  validation: IUserValidation
): validation is IUserValidation & { success: true; user: IUser } {
  return validation.success === true && validation.user !== undefined;
}
