import jwt from "jsonwebtoken";
import type { ITokenPayloadResponse } from "../types/tokenPayloadResponse.interface.ts";

export function tryRefreshToken(token: string): ITokenPayloadResponse {
  try {
    console.log(process.env.REFRESH_SECRET);
    console.log("token: ", token);
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!);
    return { isValid: true, payload: decoded };
  } catch (err) {
    return {
      isValid: false,
      expired: (err as Error).name === "TokenExpiredError",
    };
  }
}
