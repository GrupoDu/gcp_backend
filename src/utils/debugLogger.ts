import dotenv from "dotenv";
dotenv.config();

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
