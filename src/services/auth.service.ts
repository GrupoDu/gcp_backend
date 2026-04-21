import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { IRefreshToken } from "../types/refreshToken.interface.js";
import type { PrismaTransactionClient } from "../../lib/prisma.js";
import type { ILoginResponse } from "../types/auth.interface.js";
import debbugLogger from "../utils/debugLogger.js";

dotenv.config();

/**
 * Service responsável por autenticar e gerenciar tokens de autenticação.
 *
 * @class {AuthService}
 * @see {AuthController}
 */
class AuthService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Instância do PrismaClient */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Autentica um usuário e gerar tokens de acesso e refresh.
   *
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {string} user_type - Tipo de usuário
   * @returns {ILoginResponse} - Objeto contendo o usuário e os tokens de acesso e refresh
   * @see {ILoginResponse}
   */
  async userLogin(
    email: string,
    password: string,
    user_type: string,
  ): Promise<ILoginResponse> {
    const user = await this._prisma.users.findFirst({
      where: { email },
      select: { user_uuid: true, password: true, user_type: true },
    });

    if (!user) throw new Error("Credenciais inválidas.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Credenciais inválidas.");

    const isUserTypeMismatch = user.user_type !== user_type;
    if (isUserTypeMismatch) throw new Error("Credenciais inválidas.");

    // Gera tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Salva o refresh token no banco
    await this._prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        user_uuid: user.user_id, // ✅ Campo correto
        expires_at: this.calculateExpirationDate(),
        is_revoked: false,
      },
    });

    return {
      user: { user_id: user.user_id, user_type: user.user_type },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Renova o token de acesso.
   *
   * @param {string} oldRefreshToken - Antigo refresh token
   * @returns {Promise<Omit<ILoginResponse, "user">>} Objeto contendo o novo token de acesso e refresh
   * @see {ILoginResponse}
   */
  async refreshAccessToken(
    oldRefreshToken: string,
  ): Promise<Omit<ILoginResponse, "user">> {
    return await this._prisma.$transaction(async (tx) => {
      const tokenRecord = await tx.refresh_tokens.findUnique({
        where: { token: oldRefreshToken },
      });

      if (!tokenRecord) throw new Error("Refresh token não encontrado.");

      debbugLogger([`Token revogado: ${tokenRecord.is_revoked}`]);
      if (tokenRecord.is_revoked) {
        debbugLogger([`Refresh token revogado: ${tokenRecord.is_revoked}`]);
        throw new Error("Refresh token revogado.");
      }

      debbugLogger([
        `Checando se token expirou: ${tokenRecord.expires_at.toString()}`,
      ]);

      await this.checkTokenExpired(tokenRecord, tx);
      debbugLogger(["Verificação concluída.", "Verificando assinatura JWT..."]);

      const decoded = await this.verifyJWTSignature(
        oldRefreshToken,
        tx,
        tokenRecord.id,
      );

      const user = await tx.users.findUnique({
        where: { user_id: decoded.user_id },
        select: { user_id: true, user_type: true },
      });

      if (!user) throw new Error("Usuário não encontrado.");
      debbugLogger([
        "Usuário encontrado.",
        `Usuário: ${user.user_id}`,
        "Revogando antigo refresh_token...",
      ]);

      await this.revokeOldRefreshToken(tx, tokenRecord.id);
      debbugLogger(["Antigo refresh_token revogado."]);

      debbugLogger(["Gerando novos tokens..."]);
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      debbugLogger([
        "Tokens gerados.",
        `access_token: ${newAccessToken}`,
        `refresh_token: ${newRefreshToken}`,
      ]);

      await tx.refresh_tokens.create({
        data: {
          token: newRefreshToken,
          user_uuid: user.user_id,
          expires_at: this.calculateExpirationDate(),
          is_revoked: false,
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    });
  }

  /**
   * Revoga um refresh token.
   *
   * @param {string} token - refresh token
   * @returns {Promise<void>}
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this._prisma.refresh_tokens.updateMany({
      where: { token },
      data: { is_revoked: true },
    });
  }

  /**
   * Verifica se o token de refresh expirou.
   *
   * @returns {Promise<void>}
   * @param {IRefreshToken} tokenRecord - token de refresh
   * @param {PrismaTransactionClient} tx - transaction
   * @private
   * @see {IRefreshToken}
   * @see {PrismaTransactionClient}
   */
  private async checkTokenExpired(
    tokenRecord: IRefreshToken,
    tx: PrismaTransactionClient,
  ): Promise<void> {
    const isTokenExpired = tokenRecord.expires_at < new Date();
    if (isTokenExpired) {
      await tx.refresh_tokens.update({
        where: { id: tokenRecord.id },
        data: { is_revoked: true },
      });
      throw new Error("Refresh token expirado.");
    }
  }

  /**
   * Verifica a assinatura do token de refresh.
   *
   * @returns {Promise<{user_id: string}>} - ID do usuário
   * @param {string} oldRefreshToken - Antigo refresh token
   * @param {PrismaTransactionClient} tx - transaction
   * @param {string} tokenId - ID do token
   * @private
   * @see {PrismaTransactionClient}
   */
  private async verifyJWTSignature(
    oldRefreshToken: string,
    tx: PrismaTransactionClient,
    tokenId: string,
  ): Promise<{ user_id: string }> {
    debbugLogger(["Iniciando verifyJWTSignature..."]);

    if (!process.env.REFRESH_SECRET) {
      debbugLogger(["REFRESH_SECRET não está definido"]);
      throw new Error("REFRESH_SECRET não configurado.");
    }

    try {
      const decoded = jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_SECRET,
      ) as {
        user_id: string;
      };
      debbugLogger(["JWT verificado com sucesso"]);

      return decoded;
    } catch (err) {
      const error = err as Error;
      debbugLogger(["JWT verify falhou:", error.message]);
      await tx.refresh_tokens.update({
        where: { id: tokenId },
        data: { is_revoked: true },
      });
      throw new Error("Refresh token inválido.", { cause: err });
    }
  }

  /**
   * Gera um token de acesso.
   *
   * @param {string} user - Objeto com user_id e user_type
   * @returns {string} - Token de acesso
   * @private
   */
  private generateAccessToken(user: {
    user_uuid: string;
    user_type: string;
  }): string {
    return jwt.sign(
      { user_uuid: user.user_uuid, user_type: user.user_type },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      },
    );
  }

  /**
   * Gera um token de refresh.
   *
   * @param {{user_id: string}} user - Objeto com user_id
   * @returns {string} - Refresh token
   * @private
   */
  private generateRefreshToken(user: {
    user_uuid: string;
    user_type: string;
  }): string {
    return jwt.sign(
      { user_uuid: user.user_uuid, user_type: user.user_type },
      process.env.REFRESH_SECRET!,
      {
        expiresIn: "7d",
      },
    );
  }

  private async revokeOldRefreshToken(
    tx: PrismaTransactionClient,
    token_id: string,
  ) {
    await tx.refresh_tokens.update({
      where: { id: token_id },
      data: { is_revoked: true },
    });
  }

  private calculateExpirationDate(): Date {
    const days = 7;
    const hours = 24;
    const minutes = 60;
    const today = Date.now();

    return new Date(today + days * hours * minutes * 60 * 1000);
  }
}

export default AuthService;
