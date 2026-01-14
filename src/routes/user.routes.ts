import express, { type Request, type Response } from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", (req: Request, res: Response) =>
  new UserController().getAllUsers(req, res)
);
router.post("/", (req: Request, res: Response) =>
  new UserController().createNewUser(req, res)
);
router.delete("/:uuid", (req: Request, res: Response) =>
  new UserController().deleteUser(req, res)
);
router.put("/:uuid", (req: Request, res: Response) =>
  new UserController().updateUserData(req, res)
);

export default router;
