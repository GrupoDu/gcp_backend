import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type AuthService from "../services/auth.service.js";

class AuthController {
  constructor(private authService: AuthService) {}

  async userLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const env = process.env.NODE_ENV;

      const userLogged = await this.authService.userLogin(email, password);

      const token = await this.authService.generateAccessToken(
        userLogged.user_id,
        userLogged.user_type,
      );

      const DAYS = 7;
      const HOURS = 24;
      const MINUTES = 60;
      const SECONDS = 60;
      const MILLISECONDS = 1000;
      const sevenDaysMaxAge = DAYS * HOURS * MINUTES * SECONDS * MILLISECONDS;

      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          sameSite: env === "production" ? "lax" : "strict",
          maxAge: sevenDaysMaxAge,
          path: "/",
        })
        .json({
          message: `Usuário logado com sucesso.`,
        });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  isTokenStillValid(req: Request, res: Response) {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("Token inválido.");
    }

    return res.status(200).json({ status: "ok" });
  }

  // tokenValidator() {
  //   return jwt
  // }
}

export default AuthController;
