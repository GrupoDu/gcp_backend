import { responseMessages } from "../constants/messages.constants.js";
import type { IProductResponse } from "../types/product.interface.js";
import type { IProductInputData } from "../types/product.interface.js";
import type { PrismaClient } from "@prisma/client";

class ProductService {
  constructor(private prisma: PrismaClient) {}

  async getAllProductsData(): Promise<IProductResponse[]> {
    const allProducts: IProductResponse[] =
      await this.prisma.products.findMany();

    return allProducts;
  }

  async registerNewProduct(
    newProductData: IProductInputData,
  ): Promise<IProductResponse> {
    const { name, description, product_type, image } = newProductData;

    if (!name || !description || !product_type || !image) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const newProduct: IProductResponse = await this.prisma.products.create({
      data: newProductData,
    });

    return newProduct;
  }

  async updateProductData(
    productNewData: IProductInputData,
    productUuid: string,
  ): Promise<IProductResponse> {
    if (!productNewData || !productUuid) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const updatedProduct: IProductResponse = await this.prisma.products.update({
      where: {
        uuid: productUuid,
      },
      data: productNewData,
    });

    return updatedProduct;
  }

  async deleteProduct(productUuid: string): Promise<string> {
    await this.prisma.products.delete({
      where: {
        uuid: productUuid,
      },
    });

    return "Produto excluido com sucesso";
  }
}

export default ProductService;
