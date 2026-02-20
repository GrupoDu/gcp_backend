import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.ts";
import type UserService from "../services/user.service.ts";
import { getToken } from "../utils/getToken.ts";
import jwt from "jsonwebtoken";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const allUsers = await this.userService.getAllUsersData();

      return res.status(200).json(allUsers);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid) throw new Error("ID do usuário faltando.");

      const userData = await this.userService.getUserById(uuid as string);

      return res.status(200).json(userData);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async getAllSupervisorsUser(req: Request, res: Response): Promise<Response> {
    try {
      const allSupervisors = await this.userService.getAllSupervisorsUsers();

      return res.status(200).json(allSupervisors);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async tokenValidator(req: Request, res: Response): Promise<Response> {
    try {
      const token = getToken(req, res);
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

      if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido." });
      }

      const { user_type } = decodedToken as { user_type: string };

      return res.status(200).json(user_type);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async createNewUser(req: Request, res: Response): Promise<Response> {
    try {
      const newUserInfos = req.body;

      const newUser = await this.userService.registerNewUser(newUserInfos);

      return res
        .status(201)
        .json({ message: "Novo usuário criado com sucesso.", user: newUser });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      await this.userService.deleteUserData(uuid as string);

      return res.status(200).json({ message: "Usuário deletado com sucesso." });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async updateUserData(req: Request, res: Response): Promise<Response> {
    try {
      const updateInfos = req.body;
      const { uuid } = req.params;

      const updatedUser = await this.userService.updateUserData(
        updateInfos,
        uuid as string,
      );

      return res.status(200).json({
        message: "Usuário editado com successo.",
        update: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default UserController;
