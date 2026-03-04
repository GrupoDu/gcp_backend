import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import type { IUserPublic } from "../types/user.interface.js";
import { tokenErrorCases } from "../utils/tokenErrorCases.js";

dotenv.config();

export function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.tokenResponse?.payload;

    if (!token) throw new Error("Token não fornecido.");

    if (!token) {
      return res.status(401).json({ message: "Token inválido." });
    }

    // @ts-expect-error token.payload?.user_type existe
    if (token.payload?.user_type !== "admin") {
      return res.status(403).json({ message: "não autorizado." });
    }

    req.user = token.payload as IUserPublic;

    next();
  } catch (err) {
    const error = err as Error;
    const { isTokenExpiredError, isTokenInvalidError } = tokenErrorCases(error);

    if (isTokenExpiredError) {
      res
        .status(401)
        .json({ message: "Token expirado. Faça login novamente." });
      return;
    }

    if (isTokenInvalidError) {
      res.status(401).json({ message: "Token inválido." });
      return;
    }

    return res
      .status(500)
      .json({ message: "Erro no servidor.", error: error.message });
  }
}
