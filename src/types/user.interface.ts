export interface IUser {
  user_id: string;
  name: string;
  email: string;
  password: string;
  user_type: string;
}

/**
 * @extends {IUser}
 * @see {IUser}
 * @Omit user_id
 */
export interface IUserUpdate extends Partial<Omit<IUser, "user_id">> {}

/**
 * @see {IUser}
 * @extends {IUser}
 * @Omit user_id
 */
export interface IUserCreate extends Omit<IUser, "user_id"> {}

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
