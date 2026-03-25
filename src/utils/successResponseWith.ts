import type { ISuccessResponse } from "../types/response.interface.js";

/** Retorna um objeto de sucesso com as informações de data, mensagem e status.
 *
 * `status` tem `200` como valor padrão.
 * @param data
 * @param message
 * @param status
 */
export default function successResponseWith<T>(
  data: T,
  message: string,
  status?: number,
): ISuccessResponse<T> {
  return {
    data,
    status: status || 200,
    message,
    success: true,
  };
}
