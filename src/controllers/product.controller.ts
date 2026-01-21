import { type Request, type Response } from "express";
import { responseMessages } from "../constants/messages.constants.js";
import type ProductService from "../services/product.service.js";
import type { IProduct } from "../types/product.interface.js";

class ProductController {
  constructor(private productService: ProductService) {}

  async getAllProductsData(req: Request, res: Response): Promise<Response> {
    try {
      const allProducts: IProduct[] =
        await this.productService.getAllProductsData();

      return res.status(200).json({ data: allProducts });
    } catch (err) {
      return res.status(500).json({
        message: responseMessages.catchErrorMessage,
        error: (err as Error).message,
      });
    }
  }

  async registerProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productInfos = req.body;

      const newProduct: IProduct =
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
      const { productUuid, productNewData } = req.body;

      const updatedProduct: IProduct =
        await this.productService.updateProductData(
          productNewData,
          productUuid,
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
