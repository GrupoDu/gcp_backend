import { responseMessages } from "../constants/messages.constants.js";
import type {
  IProduct,
  IProductCreate,
  IProductUpdate,
} from "../types/product.interface.js";
import type { PrismaClient } from "@prisma/client";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

class ProductService {
  constructor(private prisma: PrismaClient) {}

  async getAllProductsData(): Promise<IProduct[]> {
    const allProducts: IProduct[] = await this.prisma.products.findMany();

    return allProducts;
  }

  async registerNewProduct(newProductData: IProductCreate): Promise<IProduct> {
    const { name, description, product_type, image } = newProductData;

    if (!name || !description || !product_type || !image) {
      throw new Error(responseMessages.fillAllFieldMessage);
    }

    const newProduct: IProduct = await this.prisma.products.create({
      data: newProductData,
    });

    return newProduct;
  }

  async updateProductData(
    productNewData: IProductUpdate,
    productUuid: string,
  ): Promise<IProduct> {
    if (!productUuid) throw new Error(responseMessages.fillAllFieldMessage);

    const updateFields = removeUndefinedUpdateFields(productNewData);

    if (updateFields.length < 1) throw new Error("Nenhum campo fornecido");

    const updatedProduct: IProduct = await this.prisma.products.update({
      where: {
        uuid: productUuid,
      },
      data: updateFields,
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
