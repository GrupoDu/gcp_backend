import type { NextFunction, Request, Response } from "express";
import { tryAccessToken } from "../utils/tryAccessToken.js";
import { tokenErrorCases } from "../utils/tokenErrorCases.js";
import { responseMessages } from "../constants/messages.constants.js";

export function getTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = req.cookies.access_token;

    // Primeiro, tenta ver se o access_token é válido
    if (accessToken) {
      const accessResult = tryAccessToken(accessToken);
      if (accessResult.isValid) {
        // console.log("Usando access_token válido");
        req.tokenResponse = {
          token: accessToken,
          payload: accessResult,
          token_type: "access",
        };
        return next();
      }
      // console.log("Access_token expirado ou inválido");
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

    return res.status(500).json({
      message: responseMessages.catchErrorMessage,
      error: error.message,
    });
  }
}
