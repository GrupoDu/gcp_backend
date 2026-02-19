import ProductController from "../controllers/product.controller.ts";
import express, { Router, type Request, type Response } from "express";
import ProductService from "../services/product.service.ts";
import { prisma } from "../../lib/prisma.ts";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.ts";

const router: Router = express.Router();
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
