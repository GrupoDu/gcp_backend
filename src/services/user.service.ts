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

/**
 * Service responsável por gerenciar usuários.
 * @see UserController
 * @method getAllUsersData
 * @method getAllSupervisorsUsers
 * @method getUserById
 * @method registerNewUser
 * @method updateUserData
 * @method deleteUserData
 */
class UserService {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async getAllUsersData(): Promise<IUserPublic[]> {
    const allUsersData: IUserPublic[] = await this._prisma.users.findMany({
      select: {
        email: true,
        name: true,
        user_id: true,
        user_type: true,
      },
      orderBy: { name: "asc" },
      where: {
        name: {
          not: "Admin",
        },
      },
    });

    if (allUsersData.length < 1) throw new Error("Nenhum usuário encontrado.");

    return allUsersData;
  }

  async getAllSupervisorsUsers(): Promise<IUserPublic[]> {
    const allSupervisors: IUserPublic[] = await this._prisma.users.findMany({
      where: {
        user_type: "supervisor",
      },
      select: {
        email: true,
        name: true,
        user_id: true,
        user_type: true,
      },
      orderBy: { name: "asc" },
    });

    return allSupervisors;
  }

  async getUserById(user_id: string): Promise<IUserPublic> {
    if (!user_id) throw new Error("ID do usuário não fornecido.");

    const userData = await this._prisma.users.findUnique({
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

    if (!saltRounds)
      throw new Error("Variável de ambiente SALT_ROUNDS não encontrada.");

    isEmailFormatValid(userInfos.email);

    const saltRoundsNumber = parseInt(saltRounds, 10);

    const hashPassword = await bcrypt.hash(
      userInfos.password,
      saltRoundsNumber,
    );

    const newUser: IUserPublic = await this._prisma.users.create({
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
    if (!userUuid) throw new Error(responseMessages.fillAllFieldMessage);

    const updateFields = removeUndefinedUpdateFields(userNewData);
    const hasNoFieldsToUpdate = Object.keys(updateFields).length < 1;

    if (hasNoFieldsToUpdate) throw new Error("Nenhum campo fornecido");

    const updatedUser: IUserPublic = await this._prisma.users.update({
      where: {
        user_id: userUuid,
      },
      data: {
        email: String(updateFields.email),
        name: String(updateFields.name),
        user_type: String(updateFields.user_type),
      },
    });

    return updatedUser;
  }

  async deleteUserData(userUuid: string): Promise<string> {
    if (!userUuid) throw new Error("ID do usuário não fornecido.");

    const deletedUser = await this._prisma.users.delete({
      where: {
        user_id: userUuid,
      },
    });

    if (!deletedUser) throw new Error("Usuário não encontrado.");

    return "Usuário excluido com sucesso";
  }
}

export default UserService;
