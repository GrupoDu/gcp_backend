import type TrelloNodeApi from "trello-node-api/index.js";
import dotenv from "dotenv";
import type { ITrelloCard } from "../types/trelloCard.interface.js";
dotenv.config();

/**
 * Service responsável por criar cards no trello
 *
 * @class FeedbackService
 * @see https://github.com/andrewdavies/trello-node-api
 */
class FeedbackService {
  private trello: TrelloNodeApi;

  /** @param {TrelloNodeApi} trello - Trello API client */
  constructor(trello: TrelloNodeApi) {
    this.trello = trello;
  }

  /**
   * Cria card no trello
   *
   * @param {string} card_name - Título do card
   * @param {string} card_description - Descrição do card
   * @see {ITrelloCard}
   */
  async createFeedbackCard(
    card_name: string,
    card_description: string,
  ): Promise<ITrelloCard> {
    return (await this.trello.card.create({
      name: card_name,
      desc: `## Descrição da issue\n ${card_description}`,
      idList: process.env.TRELLO_LIST_ID,
    })) as Promise<ITrelloCard>;
  }
}

export default FeedbackService;
