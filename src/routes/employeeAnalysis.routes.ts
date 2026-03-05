import express, { Router, type Request, type Response } from "express";
import EmployeeAnalysisController from "../controllers/employeeAnalysis.controller.js";
import EmployeeAnalysisService from "../services/employeeAnalysis.service.js";
import { prisma } from "../../lib/prisma.js";
import { dataAnalysisAuthorizationMiddleware } from "../middlewares/dataAnalysisAuthorization.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

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
