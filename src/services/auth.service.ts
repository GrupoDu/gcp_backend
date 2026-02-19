import type { PrismaClient } from "../../generated/prisma/client.ts";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import type {
  IUserPublic,
  IUserWithPassword,
} from "../types/user.interface.ts";

dotenv.config();

class AuthService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async userLogin(
    email: string,
    password: string,
    user_type: string,
  ): Promise<IUserPublic> {
    const saltRounds = process.env.SALT_ROUNDS || 10;

    if (!saltRounds)
      throw new Error("Variável de ambiente SALT_ROUNDS não encontrada.");

    const userTryingToLogin: IUserWithPassword =
      await this.checkIfUserExists(email, user_type);

    if (!this.isPasswordMatch(password, userTryingToLogin.password)) {
      throw new Error("Credenciais inválidas.");
    }

    const { password: _, ...userPublic } = userTryingToLogin;

    return userPublic;
  }

  private async checkIfUserExists(email: string, user_type: string): Promise<IUserWithPassword> {
    const userTryingToLogin = await this.prisma.users.findFirst({
      where: {
        email: email,
        user_type: user_type,
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        user_type: true,
        password: true,
      },
    });

    if (!userTryingToLogin) {
      throw new Error("Credenciais inválidas.");
    }

    return userTryingToLogin;
  }

  private async isPasswordMatch(
    password: string,
    userHashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, userHashPassword);
  }

  async generateAccessToken(
    user_id: string,
    user_type: string,
  ): Promise<string> {
    const secret = process.env.JWT_SECRET;

    if (!secret)
      throw new Error("Variável de ambiente JWT_SECRET não encontrada.");

    // Depois mudar expiresIn para variável de ambiente
    return jwt.sign({ user_id: user_id, user_type: user_type }, secret, {
      expiresIn: "7d",
    });
  }
}

export default AuthService;
