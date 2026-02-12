import express, { type Request, type Response } from "express";
import EmployeeController from "../controllers/employee.controller.js";
import { prisma } from "../../lib/prisma.js";
import EmployeeService from "../services/employee.service.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();
const employeeService = new EmployeeService(prisma);
const employeeController = new EmployeeController(employeeService);

router.get("/", adminAuthMiddleware, (req: Request, res: Response) => {
  employeeController.getAllEmployeesData(req, res);
});
router.post("/", adminAuthMiddleware, (req: Request, res: Response) => {
  employeeController.createNewEmployee(req, res);
});
router.get("/:uuid", adminAuthMiddleware, (req: Request, res: Response) => {
  employeeController.getEmployeeData(req, res);
});
router.delete("/:uuid", adminAuthMiddleware, (req: Request, res: Response) => {
  employeeController.removeEmployeeData(req, res);
});
router.put("/:uuid", adminAuthMiddleware, (req: Request, res: Response) => {
  employeeController.updateEmployeeData(req, res);
});
router.put(
  "/activity/:uuid",
  adminAuthMiddleware,
  (req: Request, res: Response) => {
    employeeController.updateEmployeeActivityQuantity(req, res);
  },
);

export default router;
