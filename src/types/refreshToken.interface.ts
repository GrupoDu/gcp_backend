export interface IRefreshToken {
  created_at: Date;
  id: string;
  token: string;
  user_uuid: string;
  expires_at: Date;
  revoked: boolean;
}
