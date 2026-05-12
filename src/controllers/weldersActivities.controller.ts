import type WeldersActivitiesService from "../services/weldersActivities.service.js";
import { type Request, response, type Response } from "express";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import { hasValidString } from "../utils/hasValidString.js";
import {
  MISSING_FIELDS_MESSAGE,
  REQUIRED_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import type { ICreateWeldersActivities } from "../types/weldersActivities.interface.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import { toRecord } from "../utils/toRecord.js";
import { CreateWelderActivitySchema } from "../schemas/weldersActivities.schema.js";

class WeldersActivitiesController {
  private _weldersActivitiesService: WeldersActivitiesService;

  constructor(weldersActivitiesService: WeldersActivitiesService) {
    this._weldersActivitiesService = weldersActivitiesService;
  }

  async getAllWeldersActivities(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const weldersActivities =
        await this._weldersActivitiesService.getWeldersActivities();

      return res
        .status(200)
        .json(
          successResponseWith(
            weldersActivities,
            "Atividades de soldadores encontradas com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message));
    }
  }

  async getWelderActivityById(req: Request, res: Response): Promise<Response> {
    try {
      const { welder_uuid } = req.params;

      if (!hasValidString(welder_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["welder_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const welderActivity =
        await this._weldersActivitiesService.getWelderActivitiesByWelderId(
          String(welder_uuid),
        );

      return res
        .status(200)
        .json(
          successResponseWith(
            welderActivity,
            "Dados de atividade do soldador encontrados com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message));
    }
  }

  async registerWelderActivity(req: Request, res: Response): Promise<Response> {
    try {
      const newWelderActivity = req.body as ICreateWeldersActivities;

      const { requiredFieldsMessage, isMissingFields, schemaErr } =
        checkMissingFields(
          toRecord(newWelderActivity),
          CreateWelderActivitySchema,
        );

      if (isMissingFields) {
        res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const welderActivity =
        await this._weldersActivitiesService.registerWelderActivity(
          newWelderActivity,
        );

      return res
        .status(201)
        .json(
          successResponseWith(
            welderActivity,
            "Registro de atividade do soldador realizado",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message));
    }
  }
}

export default WeldersActivitiesController;
