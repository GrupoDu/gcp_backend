import dotenv from "dotenv";
dotenv.config();

/**
 * Logger para debug.
 *
 * Só é mostrando quando a variável de ambiente NODE_ENV for "development"
 *
 * @param {string[]} log - Array de strings para log
 * @param {string} title - Título/contexto do log
 */
export default function debbugLogger(log: string[], title?: string) {
  const ENV = process.env.NODE_ENV;
  const isProd = ENV === "production";

  if (isProd) return;

  if (title) {
    console.log(`|=== ${title} ===|`);
  }
  console.log("|=== DEBUG START ===|");
  log.forEach((line) => console.log(`\t${line}`));
  console.log("|=== DEBUG END ===|\n");
}
