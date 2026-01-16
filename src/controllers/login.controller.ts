import type { Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import jwt from "jsonwebtoken";
import type { IUser } from "../types/models.interface.js";

class LoginController {
  async userLogin(req: Request, res: Response) {
    try {
      const userLoged: IUser = req.authenticatedUser;

      const token = jwt.sign(
        { user_id: userLoged.user_id, email: userLoged.email },
        "secret",
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        message: `Usuário ${userLoged.name} logado com sucesso.`,
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

export default LoginController;
