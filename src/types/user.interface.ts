export interface IUser {
  user_uuid: string;
  name: string;
  email: string;
  password: string;
  user_role: string;
  is_active: boolean;
}

/**
 * @extends {IUser}
 * @see {IUser}
 * @Omit user_uuid
 */
export interface IUserUpdate extends Partial<Omit<IUser, "user_uuid">> {}

/**
 * @see {IUser}
 * @extends {IUser}
 * @Omit user_uuid
 */
export interface IUserCreate extends Omit<IUser, "user_uuid"> {}

/**
 * @extends {IUser}
 * @see {IUser}
 * @Omit password
 */
export interface IUserPublic extends Omit<IUser, "password"> {}

/**
 * @extends {IUser}
 * @see IUser
 * @Omit password, name, email
 */
export interface IUserPayload extends Omit<
  IUser,
  "password" | "name" | "email"
> {}
