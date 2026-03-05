import express, { Router, type Request, type Response } from "express";
import EmployeeController from "../controllers/employee.controller.js";
import { prisma } from "../../lib/prisma.js";
import EmployeeService from "../services/employee.service.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const employeeService = new EmployeeService(prisma);
const employeeController = new EmployeeController(employeeService);

router.get("/", getTokenMiddleware, (req: Request, res: Response) => {
  employeeController.getAllEmployeesData(req, res);
});
router.post(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => {
    employeeController.createNewEmployee(req, res);
  },
);
router.get(
  "/:uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => {
    employeeController.getEmployeeData(req, res);
  },
);
router.delete(
  "/:uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => {
    employeeController.removeEmployeeData(req, res);
  },
);
router.put(
  "/:uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => {
    employeeController.updateEmployeeData(req, res);
  },
);
router.put(
  "/activity/:uuid",
  getTokenMiddleware,
  (req: Request, res: Response) => {
    employeeController.incrementEmployeeActivityQuantity(req, res);
  },
);
router.put(
  "/producedQuantity/:uuid",
  getTokenMiddleware,
  (req: Request, res: Response) => {
    employeeController.incrementEmployeeProductsProducedQuantity(req, res);
  },
);

export default router;
