export interface IUserLogin {
  email: string;
  password: string;
  user_role: string;
}

export interface ILoginResponse {
  user: { user_uuid: string; user_role: string };
  accessToken: string;
  refreshToken: string;
}
