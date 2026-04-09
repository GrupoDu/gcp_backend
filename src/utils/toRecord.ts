/**
 * Converte um objeto em um Record
 *
 * @param {unknown} obj - Objeto a ser transformado em Record
 * @returns {Record<string, unknown>} - Objeto convertido em Record
 */
export function toRecord(obj: unknown): Record<string, unknown> {
  return obj as Record<string, unknown>;
}
