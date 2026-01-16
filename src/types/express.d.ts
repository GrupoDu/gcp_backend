import { IUser } from "./models.interface";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser: IUser;
      tokenPayload?: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
      };
    }
  }
}
