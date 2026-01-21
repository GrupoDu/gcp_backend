import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type {
  IUserCreate,
  IUserResponse,
  IUserUpdate,
} from "../types/user.interface.js";
import type UserService from "../services/user.service.js";

class UserController {
  constructor(private userService: UserService) {}

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const allUsers: IUserResponse[] =
        await this.userService.getAllUsersData();

      return res.status(200).json({ users: allUsers });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async createNewUser(req: Request, res: Response): Promise<Response> {
    try {
      const newUserInfos: IUserCreate = req.body;

      const newUser: IUserResponse =
        await this.userService.registerNewUser(newUserInfos);

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
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }

  async updateUserData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid, updateInfos } = req.body;

      const updatedUser: IUserResponse = await this.userService.updateUserData(
        updateInfos,
        uuid,
      );

      return res.status(200).json({
        message: "Usuário editado com successo.",
        update: updatedUser,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: responseMessages.catchErrorMessage });
    }
  }
}

export default UserController;
