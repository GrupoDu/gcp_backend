import express, { type Request, type Response } from "express";
import EmployeeController from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  new EmployeeController().getAllEmployeesData(req, res);
});
router.post("/", (req: Request, res: Response) => {
  new EmployeeController().createNewEmployee(req, res);
});
router.delete("/:uuid", (req: Request, res: Response) => {
  new EmployeeController().removeEmployeeData(req, res);
});
router.put("/:uuid", (req: Request, res: Response) => {
  new EmployeeController().updateEmployeeData(req, res);
});

export default router;
