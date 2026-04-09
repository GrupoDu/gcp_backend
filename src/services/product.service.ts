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
 *
 * @class {ProductService}
 * @see ProductController
 */
class ProductService {
  private _prisma: PrismaClient;

  /** @param {PrismaClient} prisma - Prisma client */
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  /**
   * Busca todos os produtos
   *
   * @returns {Promise<IProduct[]>} Array de produtos
   * @see {IProduct}
   */
  async getAllProductsData(): Promise<IProduct[]> {
    return this._prisma.products.findMany();
  }

  /**
   * Busca um produto pelo ID
   *
   * @returns {Promise<IProduct>} Produto encontrado
   * @throws {Error} - Produto não encontrado
   * @param {string} product_uuid - ID do produto
   * @see {IProduct}
   */
  async getProductById(product_uuid: string): Promise<IProduct> {
    const product: IProduct | null = await this._prisma.products.findUnique({
      where: {
        uuid: product_uuid,
      },
    });

    if (!product) throw new Error("Produto não encontrado.");

    return product;
  }

  /**
   * Cria produto
   *
   * @param {IProductCreate} newProductData - Detalhes do novo produto
   * @returns {Promise<IProduct>} Produto criado
   * @see {IProduct}
   */
  async registerNewProduct(newProductData: IProductCreate): Promise<IProduct> {
    return this._prisma.products.create({
      data: newProductData,
    });
  }

  /**
   * Atualiza dados do produto
   *
   * @throws {Error} - Nenhum campo fornecido
   * @returns {Promise<IProduct>} Produto atualizado
   * @param {IProductUpdate} productNewData - Novos dados do produto
   * @param {string} productUuid - ID do produto
   * @see {IProductUpdate}
   */
  async updateProductData(
    productNewData: IProductUpdate,
    productUuid: string,
  ): Promise<IProduct> {
    const updateFields: IProductUpdate =
      removeUndefinedUpdateFields(productNewData);
    const hasNoFieldsToUpdate = Object.keys(updateFields).length < 1;

    if (hasNoFieldsToUpdate) throw new Error("Nenhum campo fornecido");

    return this._prisma.products.update({
      where: {
        uuid: productUuid,
      },
      data: updateFields,
    });
  }

  /**
   * Remove um produto
   *
   * @returns {Promise<string>} - Mensagem de sucesso
   * @param {string} productUuid - ID do produto
   */
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
