import { Router, type Request, type Response } from "express";
import ImageUploadController from "../controllers/imageUpload.controller.js";
import ImageUploadService from "../services/imageUpload.service.js";
import { supabase } from "../../lib/supabase.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router: Router = Router();
const imageUploadService = new ImageUploadService(supabase);
const imageUploadController = new ImageUploadController(imageUploadService);

router.post(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => imageUploadController.uploadImage(req, res),
);

export default router;
