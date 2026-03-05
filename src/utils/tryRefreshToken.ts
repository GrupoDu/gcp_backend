import jwt from "jsonwebtoken";
import type { ITokenPayloadResponse } from "../types/tokenPayloadResponse.interface.ts";

export function tryRefreshToken(token: string): ITokenPayloadResponse {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!);
    return { isValid: true, payload: decoded };
  } catch (err) {
    return {
      isValid: false,
      expired: (err as Error).name === "TokenExpiredError",
    };
  }
}
