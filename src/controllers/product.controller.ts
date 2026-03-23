import { type Request, type Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type ProductService from "../services/product.service.js";

class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async getAllProductsData(req: Request, res: Response): Promise<Response> {
    try {
      const allProducts = await this.productService.getAllProductsData();

      return res.status(200).json(allProducts);
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async getProductById(req: Request, res: Response): Promise<Response> {
    const { product_uuid } = req.params;

    try {
      const product = await this.productService.getProductById(
        product_uuid as string,
      );

      return res.status(200).json(product);
    } catch (err) {
      const error = err as Error;

      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: error.message,
      });
    }
  }

  async registerProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productInfos = req.body;

      const newProduct =
        await this.productService.registerNewProduct(productInfos);

      return res
        .status(201)
        .json({ message: "Produto registrado com sucesso.", data: newProduct });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid)
        return res
          .status(422)
          .json({ message: responseMessages.fillAllFieldMessage });

      await this.productService.deleteProduct(uuid as string);

      return res.status(200).json({ message: "Produto removido com sucesso." });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async updateProductData(req: Request, res: Response): Promise<Response> {
    try {
      const productNewData = req.body;
      const { uuid } = req.params;

      const updatedProduct = await this.productService.updateProductData(
        productNewData,
        uuid as string,
      );

      return res.status(200).json({
        message: "Produto atualizado com sucesso.",
        updated: updatedProduct,
      });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }
}

export default ProductController;
