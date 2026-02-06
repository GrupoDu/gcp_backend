import { PrismaClient } from "../../generated/prisma/client.js";
import type {
  IRegister,
  IRegisterCreate,
  IRegisterUpdate,
} from "../types/register.interface.js";
import { responseMessages } from "../constants/messages.constants.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";
import dotenv from "dotenv";
import type { IEmployee } from "../types/employee.interface.js";

dotenv.config();

class RegisterService {
  constructor(private prisma: PrismaClient) {}

  async getAllRegistersData(): Promise<IRegister[]> {
    const allRegistersData: IRegister[] = await this.prisma.register.findMany();

    if (allRegistersData.length < 1)
      throw new Error("Nenhum registro encontrado.");

    return allRegistersData;
  }

  async getRegisterData(register_id: string) {
    const registerData: IRegister | null =
      await this.prisma.register.findUnique({
        where: {
          register_id,
        },
      });

    if (!registerData) throw new Error("Registro não encontrado.");

    return registerData;
  }

  async createNewRegister(registerData: IRegisterCreate) {
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
  ): Promise<IRegister> {
    if (!uuid || !registerData)
      throw new Error(responseMessages.fillAllFieldMessage);

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
}

export default RegisterService;
