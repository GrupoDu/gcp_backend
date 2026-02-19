import express, { Router, type Request, type Response } from "express";
import EmployeeAnalysisController from "../controllers/employeeAnalysis.controller.ts";
import EmployeeAnalysisService from "../services/employeeAnalysis.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { dataAnalysisAuthorizationMiddleware } from "../middlewares/dataAnalysisAuthorization.middleware.ts";

const router: Router = express.Router();
const employeeAnalysisService = new EmployeeAnalysisService(prisma);
const employeeAnalysisController = new EmployeeAnalysisController(
  employeeAnalysisService,
);

router.get(
  "/",
  dataAnalysisAuthorizationMiddleware,
  (req: Request, res: Response) =>
    employeeAnalysisController.getEmployeeActivityAnalysis(req, res),
);

export default router;
