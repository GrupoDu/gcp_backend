import type { CookieOptions, Request, Response } from "express";
import type AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import type { IUserLogin } from "../types/auth.interface.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import { UserLoginSchema } from "../schemas/auth.schema.js";
import debbugLogger from "../utils/debugLogger.js";

dotenv.config();

/**
 * Controller responsável por autenticação e autorização.
 *
 * @see AuthService
 * @class AuthController
 */
class AuthController {
  private _authService: AuthService;
  /** @readonly Tempo de expiração do token de acesso em minutos */
  private static readonly ACCESS_TOKEN_EXPIRY_MIN = 15;
  /** @readonly Tempo de expiração do token de acesso em milissegundos */
  private static readonly ACCESS_TOKEN_EXPIRY_MS =
    AuthController.ACCESS_TOKEN_EXPIRY_MIN * 60 * 1000;
  /** @readonly Tempo de expiração do refresh token em dias */
  private static readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;
  /** @readonly Tempo de expiração do refresh token em milssegundos  */
  private static readonly REFRESH_TOKEN_EXPIRY_MS =
    AuthController.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  /** @param {AuthService} authService - Serviço de autenticação */
  constructor(authService: AuthService) {
    this._authService = authService;
  }

  /**
   * Retorna as opções de cookie para o token de acesso.
   *
   * @returns {CookieOptions} Opções de cookie
   */
  private getCookieOptions(): CookieOptions {
    // const isProduction = process.env["NODE_ENV"] === "production";

    // IMPORTANTE!
    // sameSite e secure mocados APENAS PARA TESTES
    // Quando o sistema for para produção, deve ser colocado com base em
    // "isProduction"
    return {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    };
  }

  /**
   * Método responsável por gerenciar o login.
   *
   * @param {Request} req - Request Express
   * @param {Response} res - Response Express
   * @returns {Promise<Response>} Response com token de acesso e refresh
   * @see AuthController
   */
  async userLogin(req: Request, res: Response): Promise<Response> {
    const { email, password, user_role } = req.body as IUserLogin;

    try {
      const loginValues = { email, password, user_role };
      const { schemaErr, isMissingFields, requiredFieldsMessage } =
        checkMissingFields(loginValues, UserLoginSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const { user, accessToken, refreshToken } =
        await this._authService.userLogin(email, password, user_role);

      const cookieOptions = this.getCookieOptions();

      return res
        .status(200)
        .cookie("access_token", accessToken, {
          ...cookieOptions,
          maxAge: AuthController.ACCESS_TOKEN_EXPIRY_MS,
        })
        .cookie("refresh_token", refreshToken, {
          ...cookieOptions,
          maxAge: AuthController.REFRESH_TOKEN_EXPIRY_MS,
        })
        .json(successResponseWith({ user }, "Usuário logado com sucesso."));
    } catch (err) {
      const error = err as Error;
      const isInvalidCredentials = error.message === "Credenciais inválidas.";

      if (isInvalidCredentials) {
        return res
          .status(401)
          .json(
            errorResponseWith(
              error.message,
              401,
              "Credenciais inválidas. Verifique suas credenciais e tente novamente.",
            ),
          );
      }

      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  /**
   * Método responsável por renovar o token de acesso.
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @returns {Promise<Response>} Response com token de acesso e refresh
   * @see AuthController
   */
  async refresh(req: Request, res: Response): Promise<Response> {
    const refreshToken = String(req.cookies.refresh_token);
    debbugLogger(["Rodando refresh..."]);

    try {
      if (!refreshToken || refreshToken === "undefined") {
        debbugLogger([
          "Refresh token não fornecido.",
          "Verificando se é o primeiro login...",
        ]);
        return res
          .status(401)
          .json(errorResponseWith("Refresh token não fornecido.", 401));
      }
      debbugLogger(["Refresh token fornecido.", "Gerando novos tokens..."]);

      // O service agora retorna AMBOS os tokens (rotação)
      const { accessToken, refreshToken: newRefreshToken } =
        await this._authService.refreshAccessToken(refreshToken);
      debbugLogger([
        "Novos tokens gerados.",
        `access_token: ${accessToken}`,
        `refresh_token: ${newRefreshToken}`,
      ]);

      const cookieOptions = this.getCookieOptions();

      return res
        .status(200)
        .cookie("access_token", accessToken, {
          ...cookieOptions,
          maxAge: AuthController.ACCESS_TOKEN_EXPIRY_MS,
        })
        .cookie("refresh_token", newRefreshToken, {
          ...cookieOptions,
          maxAge: AuthController.REFRESH_TOKEN_EXPIRY_MS,
        })
        .json(successResponseWith(null, "Token renovado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res
        .status(401)
        .json(errorResponseWith("Falha ao renovar token.", 401, error.message));
    }
  }

  /**
   * Método responsável por gerenciar o logout.
   *
   * @param {Request} req - Request Express
   * @param {Response} res - Response Express
   * @returns {Promise<Response>} Mensagem de logout e limpa cookies
   * @see AuthController
   */
  async userLogout(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.tokenResponse;
      debbugLogger([`token usado no logout: ${token?.token_type}`]);

      const isRefreshToken = token?.token_type === "refresh";
      debbugLogger([`isRefresh: ${isRefreshToken}`]);
      if (isRefreshToken)
        await this._authService.revokeRefreshToken(token.token);

      const cookieOptions = this.getCookieOptions();

      res
        .clearCookie("access_token", cookieOptions)
        .clearCookie("refresh_token", cookieOptions);

      return res
        .status(200)
        .json(successResponseWith(null, "Usuário deslogado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res
        .status(500)
        .json(errorResponseWith("Erro ao fazer logout.", 500, error.message));
    }
  }

  /**
   * Método responsável por verificar se o token ainda é válido.
   *
   * @param {Request} req - Request Express
   * @param {Response} res - Response Express
   * @returns {Response} Mensagem de token válido e payoad
   * @see AuthController
   */
  isTokenStillValid(req: Request, res: Response): Response {
    const token = req.tokenResponse?.token;

    if (!token)
      return res
        .status(401)
        .json(
          errorResponseWith(
            "Token inválido.",
            401,
            "Token inválido ou não fornecido.",
          ),
        );

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);

      return res
        .status(200)
        .json(successResponseWith({ payload }, "Token válido."));
    } catch {
      return res
        .status(401)
        .json(
          errorResponseWith(
            "Token expirado ou inválido.",
            401,
            "Token expirado ou inválido.",
          ),
        );
    }
  }
}

export default AuthController;
