import * as z from "zod";

export const UserSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  user_type: z.string(),
});

export const UserCreateSchema = UserSchema.omit({
  user_id: true,
});

export const UserUpdateSchema = UserSchema.partial({
  user_id: true,
});
