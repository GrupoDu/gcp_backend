import { responseMessages } from "../constants/messages.constants.js";
import type { IProductResponse } from "../types/product.interface.js";
import type { IProductInputData } from "../types/product.interface.js";
import type { PrismaClient } from "@prisma/client";

class ProductService {
  constructor(private prisma: PrismaClient) {}

  async getAllProductsData(): Promise<IProductResponse[]> {
    try {
      const allProducts: IProductResponse[] =
        await this.prisma.products.findMany();

      return allProducts;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async registerNewProduct(
    newProductData: IProductInputData,
  ): Promise<IProductResponse> {
    try {
      const { name, description, product_type, image } = newProductData;

      if (!name || !description || !product_type || !image) {
        throw new Error(responseMessages.fillAllFieldMessage);
      }

      const newProduct: IProductResponse = await this.prisma.products.create({
        data: newProductData,
      });

      return newProduct;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async updateProductData(
    productNewData: IProductInputData,
    productUuid: string,
  ): Promise<IProductResponse> {
    try {
      if (!productNewData || !productUuid) {
        throw new Error(responseMessages.fillAllFieldMessage);
      }

      const updatedProduct: IProductResponse =
        await this.prisma.products.update({
          where: {
            uuid: productUuid,
          },
          data: productNewData,
        });

      return updatedProduct;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async deleteProduct(productUuid: string): Promise<string> {
    try {
      await this.prisma.products.delete({
        where: {
          uuid: productUuid,
        },
      });

      return "Produto excluido com sucesso";
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export default ProductService;
