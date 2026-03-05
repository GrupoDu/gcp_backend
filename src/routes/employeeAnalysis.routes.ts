import express, { Router, type Request, type Response } from "express";
import EmployeeAnalysisController from "../controllers/employeeAnalysis.controller.ts";
import EmployeeAnalysisService from "../services/employeeAnalysis.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { dataAnalysisAuthorizationMiddleware } from "../middlewares/dataAnalysisAuthorization.middleware.ts";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";

const router: Router = express.Router();
const employeeAnalysisService = new EmployeeAnalysisService(prisma);
const employeeAnalysisController = new EmployeeAnalysisController(
  employeeAnalysisService,
);

router.get(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) =>
    employeeAnalysisController.getEmployeeActivityAnalysis(req, res),
);

export default router;
