import { type Request, type Response } from "express";
import type ImageUploadService from "../services/imageUpload.service.js";
import errorResponseWith from "../utils/errorResponseWith.js";
import successResponseWith from "../utils/successResponseWith.js";
import formidable from "formidable";
import checkMissingFields from "../utils/checkMissingFields.js";
import { ImageUploadSchema } from "../schemas/imageUpload.schema.js";

/**
 * Controller responsável por gerenciar o upload de imagens
 *
 * @class ImageUploadController
 */
export default class ImageUploadController {
  private _imageUploadService: ImageUploadService;

  /** @param {ImageUploadService} imageUploadService - Instância do serviço de upload */
  constructor(imageUploadService: ImageUploadService) {
    this._imageUploadService = imageUploadService;
  }

  /**
   * Endpoint para fazer o upload de uma única imagem
   *
   * @param {Request} req - Request express
   * @param {Response} res - Response express
   * @returns {Promise<Response>} Link da imagem no supabase
   */
  async uploadImage(req: Request, res: Response): Promise<Response> {
    const form = formidable({ multiples: false });

    try {
      const [fields, files] = await form.parse(req);
      const image = files.image?.[0];

      const { isMissingFields, requiredFieldsMessage, schemaErr } =
        checkMissingFields({ image }, ImageUploadSchema);

      if (isMissingFields) {
        return res
          .status(422)
          .json(errorResponseWith(schemaErr, 422, requiredFieldsMessage));
      }

      // Nesse ponto o image não é undefined devido ao checkMissingFields
      const imageUrl = await this._imageUploadService.uploadImage(image!);

      return res
        .status(201)
        .json(
          successResponseWith(
            { imageUrl },
            "Upload de imagem realizado com sucesso.",
            201,
          ),
        );
    } catch (err) {
      console.error("Erro no upload de imagem:", err);
      const error = err as Error;
      return res.status(500).json(errorResponseWith(error.message, 500));
    }
  }
}
