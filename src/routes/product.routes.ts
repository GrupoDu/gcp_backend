import ProductController from "../controllers/product.controller.js";
import express, { type Request, type Response } from "express";
import ProductService from "../services/product.service.js";
import { prisma } from "../../lib/prisma.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();
const productService = new ProductService(prisma);
const productController = new ProductController(productService);

router.get("/", (req: Request, res: Response) =>
  productController.getAllProductsData(req, res),
);
router.post("/", adminAuthMiddleware, (req: Request, res: Response) =>
  productController.registerProduct(req, res),
);
router.put("/:uuid", (req: Request, res: Response) =>
  productController.updateProductData(req, res),
);
router.delete("/:uuid", adminAuthMiddleware, (req: Request, res: Response) =>
  productController.deleteProduct(req, res),
);

export default router;
