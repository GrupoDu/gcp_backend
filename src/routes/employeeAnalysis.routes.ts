import express, { type Request, type Response } from "express";
import EmployeeAnalysisController from "../controllers/employeeAnalysis.controller.js";
import EmployeeAnalysisService from "../services/employeeAnalysis.service.js";
import { prisma } from "../../lib/prisma.js";
import { dataAnalysisAuthorizationMiddleware } from "../middlewares/dataAnalysisAuthorization.middleware.js";

const router = express.Router();
const employeeAnalysisService = new EmployeeAnalysisService(prisma);
const employeeAnalysisController = new EmployeeAnalysisController(
  employeeAnalysisService,
);

router.get(
  "/",
  dataAnalysisAuthorizationMiddleware,
  employeeAnalysisController.getEmployeeActivityAnalysis,
);

export default router;
