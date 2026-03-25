import type TrelloApiService from "../services/feedback.service.js";
import type { Request, Response } from "express";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

class TrelloApiController {
  private _trelloApiService: TrelloApiService;

  constructor(trelloApiService: TrelloApiService) {
    this._trelloApiService = trelloApiService;
  }

  // async getAllLists(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const lists = await this.trelloApiService.getAllLists();
  //     return res.status(200).json(lists);
  //   } catch (err) {
  //     return res.status(500).json({
  //       message: "Ocorreu um erro ao buscar as listas.",
  //       error: (err as Error).message,
  //     });
  //   }
  // }

  async createFeedbackCard(req: Request, res: Response): Promise<Response> {
    try {
      const cardData = req.body;

      if (isMissingFields(cardData)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["card_name", "card_description"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const newCard = await this._trelloApiService.createFeedbackCard(
        cardData.card_name as string,
        cardData.card_description as string,
      );

      return res
        .status(201)
        .json(
          successResponseWith(newCard, "Feedback enviado com sucesso.", 201),
        );
    } catch (err) {
      const error = err as Error;
      return res
        .status(500)
        .json(
          errorResponseWith(
            "Ocorreu um erro ao enviar o feedback.",
            500,
            error.message,
          ),
        );
    }
  }
}

export default TrelloApiController;
