import * as z from "zod";

export const TrelloCardSchema = z.object({
  name: z.string(),
  desc: z.string(),
  idList: z.string(),
});
