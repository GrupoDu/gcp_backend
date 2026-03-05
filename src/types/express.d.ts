import type { ITokenPayloadResponse } from "./tokenPayloadResponse.interface.js";
import type { IUserPayload } from "./user.interface.js";

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
