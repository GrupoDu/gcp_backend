import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { IUserPayload, IUserPublic } from "../types/user.interface.ts";
import { tryAccessToken } from "../utils/tryAccessToken.ts";
import { tryRefreshToken } from "../utils/tryRefreshToken.ts";
import { getTokenMiddleware } from "./getToken.middleware.ts";

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

    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expirado. Faça login novamente." });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token inválido." });
    }

    return res
      .status(500)
      .json({ message: "Erro no servidor.", error: error.message });
  }
}
