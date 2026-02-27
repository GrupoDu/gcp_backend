import jwt from "jsonwebtoken";

export function tokenErrorCases(error: Error) {
  const isTokenExpiredError = error instanceof jwt.TokenExpiredError;
  const isTokenInvalidError = error instanceof jwt.JsonWebTokenError;

  return { isTokenExpiredError, isTokenInvalidError };
}
