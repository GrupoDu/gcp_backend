import type { NextFunction, Request, Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type { IProduct, IUser } from "../types/models.interface.js";

function validateBodyValues(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const values: IUser | IProduct = req.body;

  } catch (err) {
    res.status(500).json({ message: responseMessages.catchErrorMessage });
  }
}
