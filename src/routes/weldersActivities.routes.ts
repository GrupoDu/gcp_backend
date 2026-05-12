import WeldersActivitiesService from "../services/weldersActivities.service.js";
import { prisma } from "../../lib/prisma.js";
import WeldersActivitiesController from "../controllers/weldersActivities.controller.js";
import express, { type Router } from "express";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";
import type { Request, Response } from "express";

const weldersActivitiesService = new WeldersActivitiesService(prisma);
const weldersActivitiesController = new WeldersActivitiesController(
  weldersActivitiesService,
);
const router: Router = express.Router();

router.get("/", getTokenMiddleware, (req: Request, res: Response) =>
  weldersActivitiesController.getAllWeldersActivities(req, res),
);
router.get("/:welder_uuid", getTokenMiddleware, (req: Request, res: Response) =>
  weldersActivitiesController.getWelderActivityById(req, res),
);
router.post("/register", getTokenMiddleware, (req: Request, res: Response) =>
  weldersActivitiesController.registerWelderActivity(req, res),
);

export default router;
