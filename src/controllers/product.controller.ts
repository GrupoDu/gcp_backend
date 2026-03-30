import { type Request, type Response } from "express";
import type ProductService from "../services/product.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import {
  REQUIRED_FIELDS_MESSAGE,
  MISSING_FIELDS_MESSAGE,
} from "../constants/messages.constants.js";
import { hasValidString } from "../utils/hasValidString.js";
import type {
  IProductCreate,
  IProductUpdate,
} from "../types/product.interface.js";
import checkMissingFields from "../utils/checkMissingFields.js";
import {
  ProductCreateSchema,
  ProductUpdateSchema,
} from "../schemas/product.schema.js";

/**
 * Controller responsável por gerenciar produtos
 * @see ProductService
 * @method getAllProductsData
 * @method getProductById
 * @method registerProduct
 * @method deleteProduct
 * @method updateProductData
 */
class ProductController {
  private _productService: ProductService;

  constructor(productService: ProductService) {
    this._productService = productService;
  }

  async getAllProductsData(req: Request, res: Response): Promise<Response> {
    try {
      const allProducts = await this._productService.getAllProductsData();

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
      if (!hasValidString(product_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["product_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      const product = await this._productService.getProductById(product_uuid);

      return res
        .status(200)
        .json(successResponseWith(product, "Produto encontrado com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async registerProduct(req: Request, res: Response): Promise<Response> {
    const productInfos = req.body as IProductCreate;

    try {
      const productRecord = productInfos as unknown as Record<string, unknown>;

      const { schemaErr, requiredFieldsMessage, isMissingFields } =
        checkMissingFields(productRecord, ProductCreateSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const newProduct =
        await this._productService.registerNewProduct(productInfos);

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
      const { product_uuid } = req.params;

      if (!hasValidString(product_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["product_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      await this._productService.deleteProduct(product_uuid);

      return res
        .status(200)
        .json(successResponseWith(null, "Produto removido com sucesso."));
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }

  async updateProductData(req: Request, res: Response): Promise<Response> {
    const productNewData = req.body as IProductUpdate;
    const { product_uuid } = req.params;

    try {
      const productRecord = productNewData as unknown as Record<
        string,
        unknown
      >;

      const { schemaErr, requiredFieldsMessage, isMissingFields } =
        checkMissingFields(productRecord, ProductUpdateSchema);

      if (!hasValidString(product_uuid)) {
        return res
          .status(422)
          .json(
            errorResponseWith(
              REQUIRED_FIELDS_MESSAGE(["product_uuid"]),
              422,
              MISSING_FIELDS_MESSAGE,
            ),
          );
      }

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      const updatedProduct = await this._productService.updateProductData(
        productNewData,
        product_uuid,
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
