import type TrelloApiService from "../services/feedback.service.js";
import type { Request, Response } from "express";

class TrelloApiController {
  private trelloApiService: TrelloApiService;

  constructor(trelloApiService: TrelloApiService) {
    this.trelloApiService = trelloApiService;
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
      const { card_name, card_description } = req.body;

      const newCard = await this.trelloApiService.createFeedbackCard(
        card_name as string,
        card_description as string,
      );

      return res
        .status(201)
        .json({ message: "Feedback enviado com sucesso.", card: newCard });
    } catch (err) {
      return res.status(500).json({
        message: "Ocorreu um erro ao enviar o feedback.",
        error: (err as Error).message,
      });
    }
  }
}

export default TrelloApiController;
