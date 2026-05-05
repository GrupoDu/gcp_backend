import { Router, type Request, type Response } from "express";
import ClientController from "../controllers/client.controller.js";
import ClientService from "../services/client.service.js";
import { prisma } from "../../lib/prisma.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = Router();
const clientService = new ClientService(prisma);
const clientController = new ClientController(clientService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  clientController.getAllClients(req, res),
);

router.get("/:client_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  clientController.getClientById(req, res),
);

router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  clientController.createClient(req, res),
);

router.put("/:client_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  clientController.updateClient(req, res),
);

export default router;
