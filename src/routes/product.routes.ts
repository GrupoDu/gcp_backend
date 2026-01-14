import ProductController from "../controllers/product.controller.js";
import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) =>
  new ProductController().getAllProductsData(req, res)
);

export default router;
