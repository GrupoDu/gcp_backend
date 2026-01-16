import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";

export async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const userTryingToLogin = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userTryingToLogin) {
      res.status(401).json({ message: "Usuário não encontrado." });
      return;
    }

    const userPasswordDecode = await bcrypt.compare(
      password,
      userTryingToLogin.password
    );

    if (!userPasswordDecode) {
      res.status(401).json({ message: "Senha ou email incorretos." });
      return;
    }

    req.authenticadedUser = userTryingToLogin;
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

export default validateUser;
