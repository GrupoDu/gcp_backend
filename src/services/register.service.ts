import type { PrismaClient } from "@prisma/client";
import type {
  IRegister,
  IRegisterCreate,
  IRegisterUpdate,
} from "../types/register.interface.js";
import { responseMessages } from "../constants/messages.constants.js";

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
  ): Promise<IRegister> {
    if (!uuid || !registerData)
      throw new Error(responseMessages.fillAllFieldMessage);

    const updatedRegister: IRegister = await this.prisma.register.update({
      where: {
        register_id: uuid,
      },
      data: registerData,
    });

    return updatedRegister;
  }
}

export default RegisterService;
