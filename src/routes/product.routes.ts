import ProductController from "../controllers/product.controller.js";
import express, { Router, type Request, type Response } from "express";
import ProductService from "../services/product.service.js";
import { prisma } from "../../lib/prisma.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import { getTokenMiddleware } from "../middlewares/getToken.middleware.js";

const router: Router = express.Router();
const productService = new ProductService(prisma);
const productController = new ProductController(productService);

router.get("/", (req: Request, res: Response) =>
  productController.getAllProductsData(req, res),
);
router.post(
  "/",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => productController.registerProduct(req, res),
);
router.put("/:uuid", (req: Request, res: Response) =>
  productController.updateProductData(req, res),
);
router.delete(
  "/:uuid",
  getTokenMiddleware,
  adminAuthMiddleware,
  (req: Request, res: Response) => productController.deleteProduct(req, res),
);

export default router;
