import type { CookieOptions, Request, Response } from "express";
import type AuthService from "../services/auth.service.ts";
import { responseMessages } from "../constants/messages.constants.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_EXPIRY_MIN = 15;
const ACCESS_TOKEN_EXPIRY_MS = ACCESS_TOKEN_EXPIRY_MIN * 60 * 1000;

const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const REFRESH_TOKEN_EXPIRY_MS = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  private getCookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProduction, // true apenas em produção (HTTPS)
      sameSite: isProduction ? "lax" : "lax", // "lax" funciona para localhost com portas diferentes
      path: "/",
    };
  }

  async userLogin(req: Request, res: Response) {
    try {
      const { email, password, user_type } = req.body;

      const isMissingField = !email || !password || !user_type;
      if (isMissingField) {
        return res
          .status(400)
          .json({ message: responseMessages.fillAllFieldMessage });
      }

      const { user, accessToken, refreshToken } =
        await this.authService.userLogin(email, password, user_type);

      const cookieOptions = this.getCookieOptions();

      res
        .status(200)
        .cookie("access_token", accessToken, {
          ...cookieOptions,
          maxAge: ACCESS_TOKEN_EXPIRY_MS,
        })
        .cookie("refresh_token", refreshToken, {
          ...cookieOptions,
          maxAge: REFRESH_TOKEN_EXPIRY_MS,
        })
        .json({
          message: "Usuário logado com sucesso.",
          user,
        });
    } catch (err) {
      const error = err as Error;
      const isInvalidCredentials = error.message === "Credenciais inválidas.";
      if (isInvalidCredentials) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      const isRefreshTokenMissing = !refreshToken;
      if (isRefreshTokenMissing) {
        return res
          .status(401)
          .json({ message: "Refresh token não fornecido." });
      }

      // O service agora retorna AMBOS os tokens (rotação)
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshAccessToken(refreshToken);

      const cookieOptions = this.getCookieOptions();

      res
        .cookie("access_token", accessToken, {
          ...cookieOptions,
          maxAge: ACCESS_TOKEN_EXPIRY_MS,
        })
        .cookie("refresh_token", newRefreshToken, {
          ...cookieOptions,
          maxAge: REFRESH_TOKEN_EXPIRY_MS,
        });

      return res.status(200).json({ message: "Token renovado com sucesso." });
    } catch (err) {
      // Em caso de erro, limpa os cookies por segurança
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res.status(401).json({
        message: "Falha ao renovar token.",
        error: (err as Error).message,
      });
    }
  }

  async userLogout(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.tokenResponse;
      console.log("token usado no logout: ", token);

      const isRefreshToken = token?.token_type === "refresh";
      if (isRefreshToken) {
        await this.authService.revokeRefreshToken(token.token);
      }

      const cookieOptions = this.getCookieOptions();

      res
        .clearCookie("access_token", cookieOptions)
        .clearCookie("refresh_token", cookieOptions);

      return res.json({ message: "Usuário deslogado com sucesso." });
    } catch (err) {
      return res.status(500).json({
        message: "Erro ao fazer logout.",
        error: (err as Error).message,
      });
    }
  }

  async logoutAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.user_id;
      const isUserIdMissing = !userId;
      if (isUserIdMissing) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }

      await this.authService.revokeAllUserRefreshTokens(userId);

      const cookieOptions = this.getCookieOptions();

      res
        .clearCookie("access_token", cookieOptions)
        .clearCookie("refresh_token", cookieOptions);

      return res.json({ message: "Todos os dispositivos desconectados." });
    } catch (err) {
      return res.status(500).json({
        message: "Erro ao desconectar dispositivos.",
        error: (err as Error).message,
      });
    }
  }

  isTokenStillValid(req: Request, res: Response) {
    const token = req.tokenResponse?.token;

    const isTokenMissing = !token;
    if (isTokenMissing) {
      return res.status(401).json({ message: "Token inválido." });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return res.status(200).json({ status: "ok" });
    } catch {
      return res.status(401).json({ message: "Token expirado ou inválido." });
    }
  }
}

export default AuthController;
