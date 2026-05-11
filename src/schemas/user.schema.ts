import * as z from "zod";

export const UserSchema = z.object({
  user_uuid: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  user_role: z.string(),
  is_active: z.boolean(),
});

export const UserCreateSchema = UserSchema.omit({
  user_uuid: true,
  is_active: true,
});

export const UserUpdateSchema = UserSchema.partial({
  user_uuid: true,
}).omit({ password: true });
