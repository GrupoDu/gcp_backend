import type { PrismaClient } from "@prisma/client";
import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import type {
  IUserCreate,
  IUserPublic,
  IUserUpdate,
} from "../types/user.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

class UserService {
  constructor(private prisma: PrismaClient) {}

  async getAllUsersData(): Promise<IUserPublic[]> {
    const allUsersData: IUserPublic[] = await this.prisma.user.findMany();

    if (!allUsersData) {
      throw new Error("Nenhum usuário encontrado.");
    }

    return allUsersData;
  }

  async registerNewUser(
    userInfos: IUserCreate,
    adminUserToken: string,
  ): Promise<IUserPublic> {
    const saltRounds = process.env.SALT_ROUNDS;

    if (!saltRounds) {
      throw new Error("Variável de ambiente SALT_ROUNDS não encontrada.");
    }

    if (!adminUserToken || !(await this.verifyUserToken(adminUserToken))) {
      throw new Error("Token inválido.");
    }

    if (
      !userInfos.name ||
      !userInfos.email ||
      !userInfos.password ||
      !userInfos.user_type
    ) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const saltRoundsNumber = parseInt(saltRounds, 10);

    const hashPassword = await bcrypt.hash(
      userInfos.password,
      saltRoundsNumber,
    );

    const newUser: IUserPublic = await this.prisma.user.create({
      data: {
        name: userInfos.name,
        email: userInfos.email,
        password: hashPassword,
        user_type: userInfos.user_type,
      },
    });

    return newUser;
  }

  async updateUserData(
    userNewData: IUserUpdate,
    userUuid: string,
    adminToken: string,
  ): Promise<IUserPublic> {
    if (!userUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    if (!adminToken || !(await this.verifyUserToken(adminToken)))
      throw new Error("Token inválido.");

    const updateFields = removeUndefinedUpdateFields(userNewData);

    const updatedUser: IUserPublic = await this.prisma.user.update({
      where: {
        user_id: userUuid,
      },
      data: updateFields,
    });

    return updatedUser;
  }

  async deleteUserData(userUuid: string, adminToken: string): Promise<string> {
    if (!(await this.verifyUserToken(adminToken)))
      throw new Error("Usuário sem privilégios");

    await this.prisma.user.delete({
      where: {
        user_id: userUuid,
      },
    });

    return "Usuário excluido com sucesso";
  }

  private async verifyUserToken(adminUserToken: string): Promise<boolean> {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) throw new Error("Secret inválido.");

    const tokenDecoded = jwt.verify(adminUserToken, JWT_SECRET) as IUserPublic;

    if (tokenDecoded.user_type !== "Admin") {
      return false;
    }

    return true;
  }
}

export default UserService;
