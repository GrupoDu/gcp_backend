import express, { Router, type Request, type Response } from "express";
import FeedbackController from "../controllers/feedback.controller.ts";
import FeedbackService from "../services/feedback.service.ts";
import { trello } from "../../trello/trello.ts";

const router: Router = express.Router();
const feedbackService = new FeedbackService(trello);
const feedbackController = new FeedbackController(feedbackService);

router.post("/", (req: Request, res: Response) =>
  feedbackController.createFeedbackCard(req, res),
);

export default router;
