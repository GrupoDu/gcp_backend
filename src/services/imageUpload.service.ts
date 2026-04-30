import type { SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import formidable from "formidable";

/**
 * Service responsável por lidar com o upload de imagens para o Supabase
 *
 * @class ImageUploadService
 */
export default class ImageUploadService {
  private _supabase: SupabaseClient;

  /** @param {SupabaseClient} supabase - Instância do Supabase client */
  constructor(supabase: SupabaseClient) {
    this._supabase = supabase;
  }

  /**
   * Realiza o upload da imagem e retorna a URL pública
   *
   * @param {formidable.File} image - Arquivo vindo do formidable
   * @returns {Promise<string>} URL pública da imagem
   */
  async uploadImage(image: formidable.File): Promise<string> {
    const extension = path.extname(image.originalFilename || "");
    const fileName = `${Date.now()}${extension}`;
    const fileBuffer = fs.readFileSync(image.filepath);

    console.log(`[Upload] Tentando upload de ${fileName} (${image.mimetype}) para o bucket produtos`);

    const { data, error } = await this._supabase.storage
      .from("produtos")
      .upload(fileName, fileBuffer, {
        contentType: image.mimetype || "image/png",
        upsert: true,
      });

    if (error) {
      // Log detalhado para capturar a resposta real do servidor
      console.error("[Supabase Full Error]:", JSON.stringify(error, null, 2));
      throw new Error(`Erro ao fazer upload: ${error.message}`);
    }

    const { data: publicUrlData } = this._supabase.storage
      .from("produtos")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
}
