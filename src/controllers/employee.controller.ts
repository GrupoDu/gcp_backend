import type { Request, Response } from "express";
import type EmployeeService from "../services/employee.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

class EmployeeController {
  private _employeeService: EmployeeService;

  constructor(employeeService: EmployeeService) {
    this._employeeService = employeeService;
  }

  async getAllEmployeesData(req: Request, res: Response): Promise<Response> {
    try {
      const allEmployeesData =
        await this._employeeService.getAllEmployeesData();

      return res
        .status(200)
        .json(
          successResponseWith(
            allEmployeesData,
            "Dados encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async getEmployeeData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const employeeData = await this._employeeService.getEmployeeData(
        uuid as string,
      );

      return res
        .status(200)
        .json(
          successResponseWith(
            employeeData,
            "Dados do funcionário encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async createNewEmployee(req: Request, res: Response): Promise<Response> {
    try {
      const newEmployeeData = req.body;
      const fields = Object.keys(newEmployeeData);

      if (isMissingFields(newEmployeeData)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const newEmployee =
        await this._employeeService.registerNewEmployee(newEmployeeData);

      return res
        .status(201)
        .json(
          successResponseWith(
            newEmployee,
            "Funcionário adicionado ao sistema.",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async removeEmployeeData(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this._employeeService.removeEmployeeData(uuid as string);

      return res
        .status(200)
        .json(successResponseWith(null, "Funcionário removido do sistema."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateEmployeeData(req: Request, res: Response): Promise<Response> {
    try {
      const updateEmployeeValues = req.body;
      const { uuid } = req.params;
      const fields = Object.keys(updateEmployeeValues);

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields(updateEmployeeValues)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const updatedEmployee = await this._employeeService.updateEmployeeData(
        updateEmployeeValues,
        uuid as string,
      );

      return res
        .status(200)
        .json(
          successResponseWith(
            updatedEmployee,
            "Dados do funcionário atualizados.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async incrementEmployeeActivityQuantity(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const updatedEmployeeActivity =
        await this._employeeService.incrementEmployeeActivitiesQuantity(
          uuid as string,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            updatedEmployeeActivity,
            "Quantidade de atividades atualizada.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async incrementEmployeeProductsProducedQuantity(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { uuid } = req.params;
      const { productsQuantity } = req.body;
      const productData = { productsQuantity };

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields(productData)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["productsQuantity"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const updatedEmployee =
        await this._employeeService.incrementEmployeeProductsProducedQuantity(
          uuid as string,
          productsQuantity,
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            updatedEmployee,
            "Quantidade de produtos produzidos atualizada.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default EmployeeController;
