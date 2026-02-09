import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { IUserPublic } from "../types/user.interface.js";

dotenv.config();

export function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getToken(req, res);

    if (!process.env.JWT_SECRET) throw new Error("SECRET faltando.");
    if (!token) throw new Error("Token não fornecido.");

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as unknown as IUserPublic;

    if (payload.user_type !== "admin") {
      return res.status(403).json({ message: "não autorizado." });
    }

    req.user = payload;

    next();
  } catch (err) {
    const error = err as Error;

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expirado. Faça login novamente." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido." });
    }

    console.error("Erro no middleware de autenticação:", error);
    return res
      .status(500)
      .json({ message: "Erro no servidor.", error: error.message });
  }
}

function getToken(req: Request, res: Response): string {
  const auth = req.cookies?.token;

  if (!auth) {
    console.log("Cookie token não encontrado. req.cookies:", req.cookies);
    throw new Error("TOKEN_NOT_PROVIDED");
  }

  return auth;
}
