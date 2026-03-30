import { responseMessages } from "../constants/messages.constants.js";
import type {
  IProduct,
  IProductCreate,
  IProductUpdate,
} from "../types/product.interface.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import removeUndefinedUpdateFields from "../utils/removeUndefinedUpdateFields.utils.js";

/**
 * Service responsável por gerenciar produtos.
 * @see ProductController
 * @method getAllProductsData
 * @method getProductById
 * @method registerNewProduct
 * @method updateProductData
 * @method deleteProduct
 */
class ProductService {
  private _prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async getAllProductsData(): Promise<IProduct[]> {
    const allProducts: IProduct[] = await this._prisma.products.findMany();

    return allProducts;
  }

  async getProductById(product_uuid: string): Promise<IProduct> {
    const product: IProduct | null = await this._prisma.products.findUnique({
      where: {
        uuid: product_uuid,
      },
    });

    if (!product) throw new Error("Produto não encontrado.");

    return product;
  }

  async registerNewProduct(newProductData: IProductCreate): Promise<IProduct> {
    return this._prisma.products.create({
      data: newProductData,
    });
  }

  async updateProductData(
    productNewData: IProductUpdate,
    productUuid: string,
  ): Promise<IProduct> {
    if (!productUuid) throw new Error(responseMessages.fillAllFieldMessage);

    const updateFields: IProductUpdate =
      removeUndefinedUpdateFields(productNewData);

    if (Object.keys(updateFields).length < 1)
      throw new Error("Nenhum campo fornecido");

    const updatedProduct: IProduct = await this._prisma.products.update({
      where: {
        uuid: productUuid,
      },
      data: updateFields,
    });

    return updatedProduct;
  }

  async deleteProduct(productUuid: string): Promise<string> {
    await this._prisma.products.delete({
      where: {
        uuid: productUuid,
      },
    });

    return "Produto excluido com sucesso";
  }
}

export default ProductService;
