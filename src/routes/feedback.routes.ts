import express, { Router, type Request, type Response } from "express";
import FeedbackController from "../controllers/feedback.controller.ts";
import FeedbackService from "../services/feedback.service.ts";
import { trello } from "../../trello/trello.ts";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.ts";

const router: Router = express.Router();
const feedbackService = new FeedbackService(trello);
const feedbackController = new FeedbackController(feedbackService);

// router.get("/", (req: Request, res: Response) =>
//   feedbackController.getAllLists(req, res),
// );
router.post("/", getTokenMiddleware, (req: Request, res: Response) =>
  feedbackController.createFeedbackCard(req, res),
);

export default router;
