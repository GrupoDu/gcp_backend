import * as z from "zod";
import formidable from "formidable";

export const ImageUploadSchema = z.object({
  image: z.custom<formidable.File>(),
});
