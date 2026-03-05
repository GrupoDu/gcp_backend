import type { ITokenPayloadResponse } from "./tokenPayloadResponse.interface.ts";
import type { IUserPayload } from "./user.interface.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
      tokenResponse?: {
        token: string;
        payload: ITokenPayloadResponse | null;
        token_type?: string;
      };
    }
  }
}
