import type { NextFunction, Request, Response } from "express";
import { tryAccessToken } from "../utils/tryAccessToken.js";
import { tokenErrorCases } from "../utils/tokenErrorCases.js";
import { responseMessages } from "../constants/messages.constants.js";
import { tryRefreshToken } from "../utils/tryRefreshToken.js";
import debbugLogger from "../utils/debugLogger.js";

/**
 * Middleware para obter o token de autenticação
 *
 * @returns {void | Response}
 * @param {Request} req - Request express
 * @param {Response} res - Response express
 * @param {NextFunction} next - Next express
 */
export function getTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response {
  try {
    const accessToken: string = String(req.cookies.access_token);
    const refreshToken: string = String(req.cookies.refresh_token);

    console.log(`\nAccess token: ${accessToken}\n`);
    console.log(`\nRefresh token: ${refreshToken}\n`);

    // Primeiro, tenta ver se o access_token é válido
    if (accessToken) {
      const accessResult = tryAccessToken(accessToken);
      debbugLogger([`Utilizando access_token: ${accessToken}`]);
      if (accessResult.isValid) {
        req.tokenResponse = {
          token: accessToken,
          payload: accessResult,
          token_type: "access",
        };
        return next();
      }
    }

    console.log("Nenhum token válido encontrado");
    console.log("|=== END DEBUG ===|");

    throw new Error("TOKEN_NOT_PROVIDED");
  } catch (err) {
    const error = err as Error;
    const { isTokenInvalidError, isTokenExpiredError } = tokenErrorCases(error);

    if (isTokenInvalidError)
      return res.status(401).json({ message: "Token inválido." });
    if (isTokenExpiredError)
      return res.status(401).json({ message: "Token expirado." });
    if (error.message === "TOKEN_NOT_PROVIDED")
      return res.status(401).json({
        message: "Token não fornecido.",
        error: error.message,
      });

    return res.status(500).json({
      message: responseMessages.catchErrorMessage,
      error: error.message,
    });
  }
}
