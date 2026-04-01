import * as z from "zod";

/**
 * Schema para validação de login de usuário
 * @see {IUser}
 * @see {IUserLogin}
 */
export const UserLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
  user_type: z.string(),
});
