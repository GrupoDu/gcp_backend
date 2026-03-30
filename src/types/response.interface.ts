interface IResponse {
  message: string | null;
  success: boolean;
  status: number;
}

export interface ISuccessResponse<T> extends IResponse {
  data: T;
}

export interface IErrorResponse extends IResponse {
  error: string;
}
