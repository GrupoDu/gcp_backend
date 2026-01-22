import type { NextFunction, Request, Response } from "express";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Preencha todos os campos." });
      return;
    }

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "Email e senha devem ser strings." });
      return;
    }

    if (!email.includes("@")) {
      res.status(400).json({ message: "Email inválido." });
      return;
    }

    next();

    return;
  } catch (err) {
    res.status(500).json({
      message: "Erro interno do servidor.",
      error: (err as Error).message,
    });
    return;
  }
}

export default authMiddleware;
