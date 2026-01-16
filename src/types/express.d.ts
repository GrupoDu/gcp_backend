import { IUser } from "./models.interface";

declare global {
  namespace Express {
    interface Request {
      authenticadedUser: IUser;
      tokenPayload?: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
      };
    }
  }
}
