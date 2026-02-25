import type { Request, Response } from "express";

export function getToken(req: Request, res: Response): string {
  const auth = req.cookies?.access_token;

  if (!auth) {
    throw new Error("TOKEN_NOT_PROVIDED");
  }

  return auth;
}
