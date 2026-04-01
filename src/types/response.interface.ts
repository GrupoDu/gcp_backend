interface IResponse {
  message: string | null;
  success: boolean;
  status: number;
}

/**
 * @extends {IResponse}
 * @see {IResponse}
 */
export interface ISuccessResponse<T> extends IResponse {
  data: T;
}

/**
 * @extends {IResponse}
 * @see {IResponse}
 */
export interface IErrorResponse extends IResponse {
  error: string;
}
