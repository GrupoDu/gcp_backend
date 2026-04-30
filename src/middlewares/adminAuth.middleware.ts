import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import type { IUserPublic } from "../types/user.interface.js";
import { tokenErrorCases } from "../utils/tokenErrorCases.js";
import errorResponseWith from "../utils/errorResponseWith.js";

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
      return res
        .status(401)
        .json(errorResponseWith("Token inválido.", 401, "Token inválido."));
    }

    // @ts-expect-error token.payload?.user_role existe
    if (token.payload?.user_role !== "admin") {
      return res
        .status(403)
        .json(errorResponseWith("Não autorizado.", 403, "Não autorizado."));
    }

    req.user = token.payload as IUserPublic;

    next();
  } catch (err) {
    const error = err as Error;
    const { isTokenExpiredError, isTokenInvalidError } = tokenErrorCases(error);

    if (isTokenExpiredError) {
      res
        .status(401)
        .json(
          errorResponseWith(
            "Token expirado. Faça login novamente.",
            401,
            "Token expirado. Faça login novamente.",
          ),
        );
      return;
    }

    if (isTokenInvalidError) {
      res
        .status(401)
        .json(errorResponseWith("Token inválido.", 401, "Token inválido."));
      return;
    }

    return res
      .status(500)
      .json(errorResponseWith(error.message, 500, "Erro interno do servidor."));
  }
}
