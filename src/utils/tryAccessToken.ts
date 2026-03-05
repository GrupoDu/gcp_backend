import jwt from "jsonwebtoken";
import type { ITokenPayloadResponse } from "../types/tokenPayloadResponse.interface.ts";

export function tryAccessToken(token: string): ITokenPayloadResponse {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      user_type: string;
    };
    return { isValid: true, payload: decoded };
  } catch (err) {
    return {
      isValid: false,
      expired: (err as Error).name === "TokenExpiredError",
    };
  }
}
