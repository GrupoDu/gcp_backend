import type { JwtPayload } from "jsonwebtoken";

export interface ITokenPayloadResponse {
  isValid: boolean;
  payload?: string | JwtPayload;
  expired?: boolean;
}
