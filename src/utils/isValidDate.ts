export function isValidDate(date: string) {
  if (new Date(date) < new Date()) {
    throw new Error("Data de entrega não pode ser no passado.");
  }

  return;
}
