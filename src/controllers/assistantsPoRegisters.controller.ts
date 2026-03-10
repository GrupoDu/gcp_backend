import type AssistantsPoRegistersService from "../services/assistantsPoRegisters.service.js";
import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type {
  IAssistantPORegisterIdentifiers,
  IAssistantsPORegisterCreate,
} from "../types/assistantsPoRegisters.interface.js";

export default class AssistantsPORegistersController {
  private assistantsPoRegistersService: AssistantsPoRegistersService;

  constructor(assistantsPoRegistersService: AssistantsPoRegistersService) {
    this.assistantsPoRegistersService = assistantsPoRegistersService;
  }

  async getAllAssistantsPORegisters(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allAssistantsPORegisters =
        await this.assistantsPoRegistersService.getAllAssistantsPoRegisters();

      return res.status(200).json(allAssistantsPORegisters);
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }

  async createAssistantPORegister(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const newAssistantPORegisterValues: IAssistantsPORegisterCreate = req.body;

    try {
      if (!newAssistantPORegisterValues)
        throw new Error(responseMessages.fillAllFieldMessage);

      const newAssistantPORegister =
        await this.assistantsPoRegistersService.createAssistantPORegister(
          newAssistantPORegisterValues,
        );

      return res.status(201).json({
        message: "Registro de assistente criado",
        newAssistantPORegister,
      });
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }

  async updateAssistantPORegisterAsDelivered(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const identifierValues: IAssistantPORegisterIdentifiers = req.body;

    try {
      if (!identifierValues)
        throw new Error(responseMessages.fillAllFieldMessage);

      const assistantPORegisterUpdateResponse =
        await this.assistantsPoRegistersService.updateAssistantPORegisterAsDelivered(
          identifierValues,
        );

      return res
        .status(200)
        .json({ message: assistantPORegisterUpdateResponse });
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }
}
