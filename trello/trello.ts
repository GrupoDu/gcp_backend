import dotenv from "dotenv";
import TrelloNodeApi from "trello-node-api";
dotenv.config();

const API_KEY = process.env.TRELLO_KEY || "";
const OAUTH_TOKEN = process.env.TRELLO_TOKEN || "";

export const trello = new TrelloNodeApi();
trello.setApiKey(API_KEY);
trello.setOauthToken(OAUTH_TOKEN);
