import type { NextFunction, Request, Response } from "express";
import { tryAccessToken } from "../utils/tryAccessToken.ts";

export function getTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
}
