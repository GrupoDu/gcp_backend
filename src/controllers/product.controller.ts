import { type Request, type Response } from "express";
import type ProductService from "../services/product.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import isMissingFields from "../utils/isMissingFields.js";
import {
  ARBITRARY_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";

class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async getAllProductsData(req: Request, res: Response): Promise<Response> {
    try {
      const allProducts = await this.productService.getAllProductsData();

      return res
        .status(200)
        .json(
          successResponseWith(allProducts, "Produtos encontrados com sucesso."),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async getProductById(req: Request, res: Response): Promise<Response> {
    const { product_uuid } = req.params;

    try {
      if (!product_uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["product_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const product = await this.productService.getProductById(
        product_uuid as string,
      );

      return res
        .status(200)
        .json(successResponseWith(product, "Produto encontrado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async registerProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productInfos = req.body;
      const fields = Object.keys(productInfos);

      if (isMissingFields(productInfos)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const newProduct =
        await this.productService.registerNewProduct(productInfos);

      return res
        .status(201)
        .json(
          successResponseWith(
            newProduct,
            "Produto registrado com sucesso.",
            201,
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this.productService.deleteProduct(uuid as string);

      return res
        .status(200)
        .json(successResponseWith(null, "Produto removido com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateProductData(req: Request, res: Response): Promise<Response> {
    try {
      const productNewData = req.body;
      const { uuid } = req.params;
      const fields = Object.keys(productNewData);

      if (!uuid) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(["uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields(productNewData)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              ARBITRARY_FIELDS_MESSAGE(fields),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const updatedProduct = await this.productService.updateProductData(
        productNewData,
        uuid as string,
      );

      return res
        .status(200)
        .json(
          successResponseWith(
            updatedProduct,
            "Produto atualizado com sucesso.",
          ),
        );
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}

export default ProductController;
