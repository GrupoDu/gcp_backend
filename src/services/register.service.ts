import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import type {
  IRegister,
  IRegisterCreate,
  IRegisterUpdate,
} from "../types/register.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import dotenv from "dotenv";
import type { IUserPublic } from "../types/user.interface.js";

dotenv.config();

class RegisterService {
  constructor(private prisma: PrismaClient) {}

  async getAllRegistersData(): Promise<IRegister[]> {
    const allRegistersData: IRegister[] = await this.prisma.register.findMany();

    if (!allRegistersData) throw new Error("Nenhum registro encontrado.");

    return allRegistersData;
  }

  async createNewRegister(registerData: IRegisterCreate): Promise<IRegister> {
    if (!registerData) throw new Error(responseMessages.fillAllFieldMessage);

    const newRegister: IRegister = await this.prisma.register.create({
      data: registerData,
    });

    return newRegister;
  }

  async removeRegisterData(uuid: string): Promise<string> {
    if (!uuid) throw new Error(responseMessages.fillAllFieldMessage);

    await this.prisma.register.delete({
      where: {
        register_id: uuid,
      },
    });

    return "Registro deletado com sucesso.";
  }

  async updateRegisterData(
    registerData: IRegisterUpdate,
    uuid: string,
    accessToken: string,
  ): Promise<IRegister> {
    if (!uuid || !registerData)
      throw new Error(responseMessages.fillAllFieldMessage);

    if (!accessToken) throw new Error("Token inválido");

    if (!this.isValidToken(accessToken)) throw new Error("Token invalido.");

    const updateFields = removeUndefinedUpdateFields(registerData);

    if (updateFields.length < 1) throw new Error("Nenhum campo fornecido.");

    const updatedRegister: IRegister = await this.prisma.register.update({
      where: {
        register_id: uuid,
      },
      data: updateFields,
    });

    return updatedRegister;
  }

  private isValidToken(userToken: string): boolean {
    try {
      if (!process.env.JWT_SECRET) return false;

      jwt.verify(userToken, process.env.JWT_SECRET);

      return true;
    } catch (err) {
      return false;
    }
  }
}

export default RegisterService;
