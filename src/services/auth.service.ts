import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { IRefreshToken } from "../types/refreshToken.interface.js";
import type { PrismaTransactionClient } from "../../lib/prisma.js";
import type { ILoginResponse } from "../types/auth.interface.js";

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
   * Método responsável por autenticar um usuário e gerar tokens de acesso e refresh.
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
      select: { user_id: true, password: true, user_type: true },
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

  /**
   * Método responsável por renovar o token de acesso.
   *
   * @param {string} oldRefreshToken - Antigo refresh token
   * @returns {Promise<Omit<ILoginResponse, "user">>}
   * @see {ILoginResponse}
   */
  async refreshAccessToken(
    oldRefreshToken: string,
  ): Promise<Omit<ILoginResponse, "user">> {
    // Transação para garantir atomicidade
    return await this._prisma.$transaction(async (tx) => {
      // 1. Busca o token no banco
      const tokenRecord = await tx.refresh_tokens.findUnique({
        where: { token: oldRefreshToken },
      });

      if (!tokenRecord) throw new Error("Refresh token não encontrado.");

      if (tokenRecord.revoked) throw new Error("Refresh token revogado.");

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

      if (!user) throw new Error("Usuário não encontrado.");

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

  /**
   * Método responsável por revogar um refresh token.
   *
   * @param {string} token - refresh token
   * @returns {Promise<void>}
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this._prisma.refresh_tokens.updateMany({
      where: { token },
      data: { revoked: true },
    });
  }

  /**
   * Método responsável por verificar se o token de refresh expirou.
   *
   * @returns {Promise<void>}
   * @param {IRefreshToken} tokenRecord - token de refresh
   * @param {PrismaTransactionClient} tx - transação
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
      // Marca como revogado
      await tx.refresh_tokens.update({
        where: { id: tokenRecord.id },
        data: { revoked: true },
      });
      throw new Error("Refresh token expirado.");
    }
  }

  /**
   * Método responsável por verificar a assinatura do token de refresh.
   *
   * @returns {Promise<{user_id: string}>} - ID do usuário
   * @param {string} oldRefreshToken - Antigo refresh token
   * @param {PrismaTransactionClient} tx - transação
   * @param {string} tokenId - ID do token
   * @private
   * @see {PrismaTransactionClient}
   */
  private async verifyJWTSignature(
    oldRefreshToken: string,
    tx: PrismaTransactionClient,
    tokenId: string,
  ): Promise<{ user_id: string }> {
    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_SECRET!,
    ) as {
      user_id: string;
    };

    if (!decoded) {
      await tx.refresh_tokens.update({
        where: { id: tokenId },
        data: { revoked: true },
      });
      throw new Error("Refresh token inválido.");
    }

    return decoded;
  }

  /**
   * Método responsável por revogar um token antigo de refresh.
   *
   * @returns Promise<void>
   * @param {PrismaTransactionClient} tx - Transação
   * @param {string} tokenId - ID do token
   * @private
   * @see {PrismaTransactionClient}
   */
  private async revokeOldRefreshToken(
    tx: PrismaTransactionClient,
    tokenId: string,
  ): Promise<void> {
    await tx.refresh_tokens.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  /**
   * Método responsável por gerar um token de acesso.
   *
   * @param {string} user - Objeto com user_id e user_type
   * @returns {string} - Token de acesso
   * @private
   */
  private generateAccessToken(user: {
    user_id: string;
    user_type: string;
  }): string {
    return jwt.sign(
      { user_id: user.user_id, user_type: user.user_type },
      process.env.JWT_SECRET!,
      {
        expiresIn: "2h",
      },
    );
  }

  /**
   * Método responsável por gerar um token de refresh.
   *
   * @param {{user_id: string}} user - Objeto com user_id
   * @returns {string} - Refresh token
   * @private
   */
  private generateRefreshToken(user: { user_id: string }): string {
    return jwt.sign({ user_id: user.user_id }, process.env.REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }

  /**
   * Método responsável por salvar o refresh token no banco.
   *
   * @param {PrismaTransactionClient} tx
   * @param {{user_id: string}} user - ID do usuário
   * @param {string} newRefreshToken - Novo refresh token
   * @returns {Promise<void>}
   * @private
   * @see {PrismaTransactionClient}
   */
  private async saveRefreshToken(
    tx: PrismaTransactionClient,
    user: { user_id: string },
    newRefreshToken: string,
  ): Promise<void> {
    await tx.refresh_tokens.create({
      data: {
        token: newRefreshToken,
        user_uuid: user.user_id, // ✅ Campo correto
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
      },
    });
  }

  /**
   * Método responsável por revogar todos os refresh tokens de um usuário.
   *
   * @returns {Promise<void>}
   * @param {string} userId - ID do usuário
   */
  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this._prisma.refresh_tokens.updateMany({
      where: { user_uuid: userId },
      data: { revoked: true },
    });
  }
}

export default AuthService;
