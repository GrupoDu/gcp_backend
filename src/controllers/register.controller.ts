import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import { prisma } from "../../lib/prisma.js";
import type { IRegister } from "../types/models.interface.js";

class RegisterController {
  async getAllProductionRegisters(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const allProductionRegisters: IRegister[] =
        await prisma.register.findMany();

      return res.status(200).json(allProductionRegisters);
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async createNewRegister(req: Request, res: Response): Promise<Response> {
    try {
      const newRegisterData = req.body;

      const newRegister: IRegister = await prisma.register.create({
        data: newRegisterData,
      });

      return res.status(201).json({
        message: "Registro criado com sucesso.",
        register: newRegister,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async removeRegisterData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      const registerToBeDeleter = {
        where: {
          register_id: uuid as string,
        },
      };

      await prisma.register.delete(registerToBeDeleter);

      return res
        .status(200)
        .json({ message: "Registro deletado com sucesso. " });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async updateRegister(req: Request, res: Response): Promise<Response> {
    try {
      const updateRegisterValues = req.body;
      const { uuid } = req.params;

      const registerToBeUpdated = {
        where: {
          register_id: uuid as string,
        },
        data: updateRegisterValues,
      };

      const updatedRegister: IRegister = await prisma.register.update(
        registerToBeUpdated
      );

      return res.status(200).json({
        message: "Registro atualizado com sucesso.",
        update: updatedRegister,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }
}

export default RegisterController;
