import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcrypt";
import type {
  IUserCreate,
  IUserPublic,
  IUserUpdate,
} from "../types/user.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import { isEmailFormatValid } from "../utils/emailFormatValidator.util.js";

class UserService {
  constructor(private prisma: PrismaClient) {}

  async getAllUsersData(): Promise<IUserPublic[]> {
    const allUsersData: IUserPublic[] = await this.prisma.user.findMany();

    if (!allUsersData) {
      throw new Error("Nenhum usuário encontrado.");
    }

    return allUsersData;
  }

  async getUserData(user_id: string): Promise<IUserPublic> {
    const userData = await this.prisma.user.findUnique({
      where: {
        user_id,
      },
    });

    if (!userData) throw new Error("Usuário não encontrado.");

    return userData;
  }

  async registerNewUser(userInfos: IUserCreate): Promise<IUserPublic> {
    const saltRounds = process.env.SALT_ROUNDS;

    if (!saltRounds) {
      throw new Error("Variável de ambiente SALT_ROUNDS não encontrada.");
    }

    if (
      !userInfos.name ||
      !userInfos.email ||
      !userInfos.password ||
      !userInfos.user_type
    ) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    isEmailFormatValid(userInfos.email);

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
  ): Promise<IUserPublic> {
    if (!userUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updateFields = removeUndefinedUpdateFields(userNewData);

    if (Object.keys(updateFields).length < 1)
      throw new Error("Nenhum campo fornecido");

    const updatedUser: IUserPublic = await this.prisma.user.update({
      where: {
        user_id: userUuid,
      },
      data: updateFields,
    });

    return updatedUser;
  }

  async deleteUserData(userUuid: string): Promise<string> {
    if (!userUuid) throw new Error("id do usuário não fornecido.");

    const deletedUser = await this.prisma.user.delete({
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
