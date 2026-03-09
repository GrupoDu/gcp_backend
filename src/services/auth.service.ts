import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { IRefreshToken } from "../types/refreshToken.interface.js";

dotenv.config();

class AuthService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async userLogin(email: string, password: string, user_type: string) {
    const user = await this.prisma.users.findFirst({
      where: { email },
      select: { user_id: true, password: true, user_type: true },
    });

    const isUserNotFound = !user;
    if (isUserNotFound) {
      throw new Error("Credenciais inválidas.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas.");
    }

    const isUserTypeMismatch = user.user_type !== user_type;
    if (isUserTypeMismatch) {
      throw new Error("Credenciais inválidas.");
    }

    // Gera tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Salva o refresh token no banco
    await this.prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        user_uuid: user.user_id, // ✅ Campo correto
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
      },
    });

    return {
      user: { user_id: user.user_id, user_type: user.user_type },
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(oldRefreshToken: string) {
    // Transação para garantir atomicidade
    return await this.prisma.$transaction(async (tx) => {
      // 1. Busca o token no banco
      const tokenRecord = await tx.refresh_tokens.findUnique({
        where: { token: oldRefreshToken },
      });

      const isTokenMissing = !tokenRecord;
      if (isTokenMissing) {
        throw new Error("Refresh token não encontrado.");
      }

      const isTokenRevoked = tokenRecord.revoked;
      if (isTokenRevoked) {
        throw new Error("Refresh token revogado.");
      }

      // 2. Verifica expiração
      await this.checkTokenExpired(tokenRecord, tx);

      // 3. Verifica a assinatura JWT
      const decoded = await this.verifyJWTSignature(
        oldRefreshToken,
        tx,
        tokenRecord.id,
      );

      // 4. Verifica se o usuário ainda existe
      const user = await tx.users.findUnique({
        where: { user_id: decoded.user_id },
        select: { user_id: true, user_type: true },
      });

      const isUserMissing = !user;
      if (isUserMissing) {
        throw new Error("Usuário não encontrado.");
      }

      // 5. Revoga o token antigo (uso único)
      await this.revokeOldRefreshToken(tx, tokenRecord.id);

      // 6. Gera novos tokens
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // 7. Salva o novo refresh token
      await this.saveRefreshToken(tx, user, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    });
  }

  async revokeRefreshToken(token: string) {
    await this.prisma.refresh_tokens.updateMany({
      where: { token },
      data: { revoked: true },
    });
  }

  private async checkTokenExpired(tokenRecord: IRefreshToken, tx: any) {
    const isTokenExpired = tokenRecord.expires_at < new Date();
    if (isTokenExpired) {
      // Marca como revogado
      await tx.refresh_tokens.update({
        where: { id: tokenRecord.id },
        data: { revoked: true },
      });
      throw new Error("Refresh token expirado.");
    }
  }

  private async verifyJWTSignature(
    oldRefreshToken: string,
    tx: any,
    tokenId: string,
  ): Promise<{ user_id: string }> {
    try {
      const decoded = jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_SECRET!,
      ) as {
        user_id: string;
      };
      return decoded;
    } catch (jwtError) {
      await tx.refresh_tokens.update({
        where: { id: tokenId },
        data: { revoked: true },
      });
      throw new Error("Refresh token inválido.");
    }
  }

  private async revokeOldRefreshToken(tx: any, tokenId: string): Promise<void> {
    await tx.refresh_tokens.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  private generateAccessToken(user: {
    user_id: string;
    user_type: string;
  }): string {
    return jwt.sign(
      { user_id: user.user_id, user_type: user.user_type },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      },
    );
  }

  private generateRefreshToken(user: { user_id: string }): string {
    return jwt.sign({ user_id: user.user_id }, process.env.REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }

  private async saveRefreshToken(
    tx: any,
    user: { user_id: string },
    newRefreshToken: string,
  ) {
    await tx.refresh_tokens.create({
      data: {
        token: newRefreshToken,
        user_uuid: user.user_id, // ✅ Campo correto
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
      },
    });
  }

  async revokeAllUserRefreshTokens(userId: string) {
    await this.prisma.refresh_tokens.updateMany({
      where: { user_uuid: userId },
      data: { revoked: true },
    });
  }
}

export default AuthService;
