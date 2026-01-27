import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type { IUserPublic } from "../types/user.interface.js";
import type AuthService from "../services/auth.service.js";

class AuthController {
  constructor(private authService: AuthService) {}

  async userLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userLogged: IUserPublic = await this.authService.userLogin(
        email,
        password,
      );

      const token = await this.authService.generateAccessToken(
        userLogged.user_id,
        userLogged.user_type,
      );

      return res.status(200).json({
        message: `Usuário logado com sucesso.`,
        token: token,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default AuthController;
