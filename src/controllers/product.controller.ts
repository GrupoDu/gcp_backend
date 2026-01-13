import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import type { IProduct } from "../types/models.interface.js";
import type { JsonValue } from "@prisma/client/runtime/client";

class ProductController {
  private errorMessage = "Houve um erro de conexão";

  async getAllProductsData(req: Request, res: Response): Promise<Response> {
    try {
      const searchByProductType = {
        where: {
          product_type: "carro de mão",
        },
      };

      const allProducts = await prisma.products.findMany(searchByProductType);

      return res.status(200).json(allProducts);
    } catch (err) {
      return res.status(500).json({
        message: this.errorMessage,
        error: (err as Error).message,
      });
    }
  }

  async registerProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productInfos: IProduct = req.body;

      if (
        !productInfos.name ||
        !productInfos.description ||
        !productInfos.product_type ||
        !productInfos.image
      ) {
        throw new Error("Por favor, preencha os campos obrigatórios.");
      }

      const newProduct: IProduct = await prisma.products.create({
        data: {
          name: productInfos.name,
          description: productInfos.description,
          product_type: productInfos.product_type,
          image: productInfos.image,
          features: productInfos.features,
          acronym: productInfos.acronym,
          composition: productInfos.composition,
        },
      });

      return res
        .status(201)
        .json({ message: "Produto registrado com sucesso.", data: newProduct });
    } catch (err) {
      return res.status(500).json({
        message: this.errorMessage,
        error: (err as Error).message,
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.body;

      if (!uuid) throw new Error();

      const productToBeDeleted = {
        where: {
          uuid: uuid,
        },
      };

      await prisma.products.delete(productToBeDeleted);

      return res.status(200).json({ message: "Produto removido com sucesso." });
    } catch (err) {
      return res
        .status(500)
        .json({ message: this.errorMessage, error: (err as Error).message });
    }
  }

  async updateProductData(req: Request, res: Response): Promise<Response> {
    try {
      const { updateValues, uuid } = req.body;

      const updatedData = {
        data: updateValues,
        where: {
          uuid: uuid,
        },
      };

      const updatedProduct = await prisma.products.update(updatedData);

      return res.status(200).json({
        message: "Produto atualizado com sucesso.",
        updated: updatedProduct,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: this.errorMessage, error: (err as Error).message });
    }
  }
}

export default ProductController;
