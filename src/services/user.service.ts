import { PrismaClient } from "../../generated/prisma/client.ts";
import bcrypt from "bcrypt";
import type {
  IUserCreate,
  IUserPublic,
  IUserUpdate,
} from "../types/user.interface.ts";
import { responseMessages } from "../constants/messages.constants.ts";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.ts";
import { isEmailFormatValid } from "../utils/emailFormatValidator.util.ts";

class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllUsersData(): Promise<IUserPublic[]> {
    const allUsersData: IUserPublic[] = await this.prisma.users.findMany({
      select: {
        email: true,
        name: true,
        user_id: true,
        user_type: true,
      },
    });

    if (allUsersData.length < 1) {
      throw new Error("Nenhum usuário encontrado.");
    }

    return allUsersData;
  }

  async getUserData(user_id: string): Promise<IUserPublic> {
    if (!user_id) throw new Error("ID do usuário não fornecido.");

    const userData = await this.prisma.users.findUnique({
      where: {
        user_id,
      },
      select: {
        email: true,
        name: true,
        user_id: true,
        user_type: true,
      },
    });

    if (!userData) throw new Error("Usuário não encontrado.");

    return userData;
  }

  async registerNewUser(userInfos: IUserCreate): Promise<IUserPublic> {
    const saltRounds = process.env.SALT_ROUNDS;
    const { name, email, password, user_type } = userInfos;

    if (!saltRounds) {
      throw new Error("Variável de ambiente SALT_ROUNDS não encontrada.");
    }

    if (!name || !email || !password || !user_type) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    isEmailFormatValid(userInfos.email);

    const saltRoundsNumber = parseInt(saltRounds, 10);

    const hashPassword = await bcrypt.hash(
      userInfos.password,
      saltRoundsNumber,
    );

    const newUser: IUserPublic = await this.prisma.users.create({
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
  ): Promise<IUserPublic> {
    if (!userUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updateFields = removeUndefinedUpdateFields(userNewData);

    if (Object.keys(updateFields).length < 1)
      throw new Error("Nenhum campo fornecido");

    const updatedUser: IUserPublic = await this.prisma.users.update({
      where: {
        user_id: userUuid,
      },
      data: {
        email: updateFields.email,
        name: updateFields.name,
        user_type: updateFields.user_type,
      },
    });

    return updatedUser;
  }

  async deleteUserData(userUuid: string): Promise<string> {
    if (!userUuid) throw new Error("ID do usuário não fornecido.");

    const deletedUser = await this.prisma.users.delete({
      where: {
        user_id: userUuid,
      },
    });

    if (!deletedUser) {
      throw new Error("Usuário não encontrado.");
    }

    return "Usuário excluido com sucesso";
  }
}

export default UserService;
