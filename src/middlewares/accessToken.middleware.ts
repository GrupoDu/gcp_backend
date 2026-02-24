import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function accessTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Pega o token do cookie (access_token)
    const token = req.cookies.access_token;

    if (!token) {
      res.status(401).json({ message: "Token de acesso não fornecido." });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET não definida nas variáveis de ambiente.");
    }

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Token de acesso expirado.",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    if (err instanceof jwt.JsonWebTokenError) {
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

export default accessTokenMiddleware;
