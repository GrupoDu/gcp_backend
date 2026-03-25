import type { CookieOptions, Request, Response } from "express";
import type AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

dotenv.config();

const ACCESS_TOKEN_EXPIRY_MIN = 120;
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
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    };
  }

  async userLogin(req: Request, res: Response) {
    try {
      const { email, password, user_type } = req.body;
      const loginData = { email, password, user_type };

      if (isMissingFields(loginData)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["email", "password", "user_type"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
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
        .json(successResponseWith({ user }, "Usuário logado com sucesso."));
    } catch (err) {
      const error = err as Error;
      const isInvalidCredentials = error.message === "Credenciais inválidas.";
      if (isInvalidCredentials) {
        return res.status(401).json(errorResponseWith(error.message, 401));
      }
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      const isRefreshTokenMissing = !refreshToken;
      if (isRefreshTokenMissing) {
        return res
          .status(401)
          .json(errorResponseWith("Refresh token não fornecido.", 401));
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

      return res
        .status(200)
        .json(successResponseWith(null, "Token renovado com sucesso."));
    } catch (err) {
      // Em caso de erro, limpa os cookies por segurança
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res
        .status(401)
        .json(
          errorResponseWith(
            "Falha ao renovar token.",
            401,
            (err as Error).message,
          ),
        );
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

      return res
        .status(200)
        .json(successResponseWith(null, "Usuário deslogado com sucesso."));
    } catch (err) {
      return res
        .status(500)
        .json(
          errorResponseWith(
            "Erro ao fazer logout.",
            500,
            (err as Error).message,
          ),
        );
    }
  }

  async logoutAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.user_id;
      const isUserIdMissing = !userId;
      if (isUserIdMissing) {
        return res
          .status(401)
          .json(errorResponseWith("Usuário não autenticado.", 401));
      }

      await this.authService.revokeAllUserRefreshTokens(userId);

      const cookieOptions = this.getCookieOptions();

      res
        .clearCookie("access_token", cookieOptions)
        .clearCookie("refresh_token", cookieOptions);

      return res
        .status(200)
        .json(
          successResponseWith(null, "Todos os dispositivos desconectados."),
        );
    } catch (err) {
      return res
        .status(500)
        .json(
          errorResponseWith(
            "Erro ao desconectar dispositivos.",
            500,
            (err as Error).message,
          ),
        );
    }
  }

  isTokenStillValid(req: Request, res: Response) {
    const token = req.tokenResponse?.token;

    const isTokenMissing = !token;
    if (isTokenMissing) {
      return res.status(401).json(errorResponseWith("Token inválido.", 401));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);

      return res
        .status(200)
        .json(successResponseWith({ payload }, "Token válido."));
    } catch {
      return res
        .status(401)
        .json(errorResponseWith("Token expirado ou inválido.", 401));
    }
  }
}

export default AuthController;
