import type { Request, Response } from "express";
import type RegisterService from "../services/register.service.js";
import type {
  IRegister,
  IRegisterUpdate,
} from "../types/register.interface.js";
import { responseMessages } from "../constants/messages.constants.js";

class RegisterController {
  constructor(private registerService: RegisterService) {}

  async getAllProductionRegisters(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allProductionRegisters =
        await this.registerService.getAllRegistersData();

      return res.status(200).json({ registers: allProductionRegisters });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async getRegisterData(req: Request, res: Response): Promise<Response> {
    const { uuid } = req.params;

    try {
      if (!uuid) throw new Error("id do registro não informado.");

      const registerData = await this.registerService.getRegisterData(
        uuid as string,
      );

      return res.status(200).json(registerData);
    } catch (err) {
      return res.status(500).json({
        message: "Erro interno de servidor.",
        error: (err as Error).message,
      });
    }
  }

  async createNewRegister(req: Request, res: Response): Promise<Response> {
    try {
      const newRegisterData = req.body;

      const newRegister =
        await this.registerService.createNewRegister(newRegisterData);

      return res.status(201).json({
        message: "Registro criado com sucesso.",
        register: newRegister,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async removeRegisterData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid)
        return res
          .status(422)
          .json({ message: responseMessages.fillAllFieldMessage });

      await this.registerService.removeRegisterData(uuid as string);

      return res
        .status(200)
        .json({ message: "Registro deletado com sucesso. " });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async updateRegister(req: Request, res: Response): Promise<Response> {
    try {
      const updateRegisterValues = req.body;
      const { uuid } = req.params;

      const updatedRegister = await this.registerService.updateRegisterData(
        updateRegisterValues,
        uuid as string,
      );

      return res.status(200).json({
        message: "Registro atualizado com sucesso.",
        update: updatedRegister,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default RegisterController;
