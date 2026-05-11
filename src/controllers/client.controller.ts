import type { Request, Response } from "express";
import ClientService from "../services/client.service.js";
import type { IClientCreate, IClientUpdate } from "../types/client.interface.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import { hasValidString } from "../utils/hasValidString.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import { ClientSchema, ClientUpdateSchema } from "../schemas/client.schema.js";

/**
 * Controller responsável por gerenciar clientes
 */
class ClientController {
  private _clientService: ClientService;

  constructor(clientService: ClientService) {
    this._clientService = clientService;
  }

  async getAllClients(req: Request, res: Response): Promise<Response> {
    try {
      const clients = await this._clientService.getAllClients();
      return res
        .status(200)
        .json(successResponseWith(clients, "Clientes encontrados com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async getClientById(req: Request, res: Response): Promise<Response> {
    const { client_uuid } = req.params;

    try {
      if (!hasValidString(client_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["client_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const client = await this._clientService.getClientById(client_uuid);

      return res
        .status(200)
        .json(successResponseWith(client, "Cliente encontrado com sucesso."));
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Cliente não encontrado" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }

  async createClient(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body as IClientCreate;
      const { schemaErr, isMissingFields, requiredFieldsMessage } =
        checkMissingFields(data, ClientSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const newClient = await this._clientService.createClient(data);

      return res
        .status(201)
        .json(successResponseWith(newClient, "Cliente criado com sucesso", 201));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateClient(req: Request, res: Response): Promise<Response> {
    const { client_uuid } = req.params;
    const updateData = req.body as IClientUpdate;

    try {
      const { isMissingFields } = checkMissingFields(
        updateData,
        ClientUpdateSchema,
      );

      if (!hasValidString(client_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["client_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields) {
        return res
          .status(400)
          .json(
            errorResponseWith(
              "Nenhum campo para atualização foi fornecido",
              400,
            ),
          );
      }

      const updated = await this._clientService.updateClient(
        client_uuid,
        updateData,
      );

      return res
        .status(200)
        .json(successResponseWith(updated, "Cliente atualizado com sucesso."));
    } catch (err) {
      const error = err as Error;
      const status = error.message === "Cliente não encontrado" ? 404 : 500;
      return res.status(status).json(errorResponseWith(error.message, status));
    }
  }
}

export default ClientController;
