import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.ts";
import type AuthService from "../services/auth.service.ts";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async userLogin(req: Request, res: Response) {
    try {
      const { email, password, user_type } = req.body;
      const env = process.env.NODE_ENV;

      if (!email || !password || !user_type) {
        return res
          .status(400)
          .json({ message: responseMessages.fillAllFieldMessage });
      }

      const userLogged = await this.authService.userLogin(
        email,
        password,
        user_type,
      );

      const { user_id, ...userWithoutId } = userLogged;

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
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
          secure: true,
          maxAge: sevenDaysMaxAge,
          path: "/",
        })
        .json({
          message: `Usuário logado com sucesso.`,
          user: userWithoutId,
        });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async userLogout(req: Request, res: Response): Promise<Response> {
    const isProduction = process.env.NODE_ENV === "production";

    return res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: isProduction ? "strict" : "lax",
        secure: isProduction,
        path: "/",
      })
      .json({ message: "Usuário deslogado." });
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
