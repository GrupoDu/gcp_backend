import type { IErrorResponse } from "../types/response.interface.js";

/**
 * Retorna um objeto de erro com as informações de status, mensagem e erro.
 *
 * `status` tem `500` como valor padrão.
 *
 * Se for erro de campos faltantes, prefira usar `ARBITRARY_FIELDS_MESSAGE(fields)` como `error`.
 * @see ARBITRARY_FIELDS_MESSAGE
 * @param error
 * @param status
 * @param message
 */
export default function errorResponseWith(
  error: string,
  status?: number,
  message?: string,
): IErrorResponse {
  return {
    status: status || 500,
    message: message || "Erro interno do servidor.",
    success: false,
    error,
  };
}
