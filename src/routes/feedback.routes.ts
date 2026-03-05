import express, { Router, type Request, type Response } from "express";
import FeedbackController from "../controllers/feedback.controller.js";
import FeedbackService from "../services/feedback.service.js";
import { trello } from "../../trello/trello.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

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
