import type { NextFunction, Request, Response } from "express";
import { tokenErrorCases } from "../utils/tokenErrorCases.js";

export default function accessTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    // Pega o token do cookie (access_token)
    const token = String(req.cookies.access_token);

    if (!token) {
      res.status(401).json({ message: "Token de acesso não fornecido." });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error("JWT_SECRET não definida nas variáveis de ambiente.");

    req.tokenResponse = { token: token, payload: null };
    next();
  } catch (err) {
    const error = err as Error;
    const { isTokenExpiredError, isTokenInvalidError } = tokenErrorCases(error);

    if (isTokenExpiredError) {
      res.status(401).json({
        message: "Token de acesso expirado.",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    if (isTokenInvalidError) {
      res.status(401).json({
        message: "Token de acesso inválido.",
      });
      return;
    }

    res.status(500).json({
      message: "Erro interno do servidor.",
      error: (err as Error).message,
    });
  }
}
