import type TrelloNodeApi from "trello-node-api/index.js";
import dotenv from "dotenv";
dotenv.config();

class FeedbackService {
  private trello: TrelloNodeApi;

  constructor(trello: TrelloNodeApi) {
    this.trello = trello;
  }
  async createFeedbackCard(card_name: string, card_description: string) {
    const newCard = await this.trello.card.create({
      name: card_name,
      desc: `## Descrição da issue\n ${card_description}`,
      idList: process.env.TRELLO_LIST_ID,
    });

    return newCard;
  }
}

export default FeedbackService;
