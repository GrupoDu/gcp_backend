import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { IJwtPayload } from "../types/jwtPayload.interface.ts";
import { responseMessages } from "../constants/messages.constants.ts";
import { tokenErrorCases } from "../utils/tokenErrorCases.ts";

export function dataAnalysisAuthorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.tokenResponse?.token;
    const jwt_secret = process.env.JWT_SECRET;

    if (!jwt_secret) {
      return res.status(401).json({ message: "Secret não fornecido." });
    }

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    const payload = jwt.verify(token, jwt_secret) as IJwtPayload;

    if (!payload) {
      return res.status(401).json({ message: "Token inválido." });
    }

    if (payload.user_type !== "admin") {
      return res.status(401).json({ message: "Não autorizado." });
    }

    next();
    return;
  } catch (err) {
    const error = err as Error;
    const { isTokenExpiredError, isTokenInvalidError } = tokenErrorCases(error);

    if (isTokenExpiredError) {
      return res.status(401).json({ message: "Token expirado" });
    }
    if (isTokenInvalidError) {
      return res.status(401).json({ message: "Token inválido" });
    }

    return res.status(500).json({
      message: responseMessages.catchErrorMessage,
      error: (err as Error).message,
    });
  }
}
