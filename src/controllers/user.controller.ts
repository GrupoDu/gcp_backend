import type { Request, Response } from "express";
import type UserService from "../services/user.service.js";
import dotenv from "dotenv";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

dotenv.config();

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const allUsers = await this.userService.getAllUsersData();

      return res
        .status(200)
        .json(
          successResponseWith(allUsers, "Usuários encontrados com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const userData = await this.userService.getUserById(uuid as string);

      return res
        .status(200)
        .json(successResponseWith(userData, "Usuário encontrado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async getAllSupervisorsUser(req: Request, res: Response): Promise<Response> {
    try {
      const allSupervisors = await this.userService.getAllSupervisorsUsers();

      return res
        .status(200)
        .json(
          successResponseWith(
            allSupervisors,
            "Supervisores encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async createNewUser(req: Request, res: Response): Promise<Response> {
    try {
      const newUserInfos = req.body;
      const fields = Object.keys(newUserInfos);

      if (isMissingFields(newUserInfos)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const newUser = await this.userService.registerNewUser(newUserInfos);

      return res
        .status(201)
        .json(
          successResponseWith(newUser, "Novo usuário criado com sucesso.", 201),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this.userService.deleteUserData(uuid as string);

      return res
        .status(200)
        .json(successResponseWith(null, "Usuário deletado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateUserData(req: Request, res: Response): Promise<Response> {
    try {
      const updateInfos = req.body;
      const { uuid } = req.params;
      const fields = Object.keys(updateInfos);

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields(updateInfos)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const updatedUser = await this.userService.updateUserData(
        updateInfos,
        uuid as string,
      );

      return res
        .status(200)
        .json(successResponseWith(updatedUser, "Usuário editado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async tokenValidator(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.tokenResponse?.payload;

      if (!token?.isValid) {
        return res.status(401).json(errorResponseWith("Token expirado.", 401));
      }

      if (token?.payload) {
        return res
          .status(200)
          .json(successResponseWith(token.payload, "Token válido."));
      }

      return res.status(401).json(errorResponseWith("Token inválido.", 401));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default UserController;
