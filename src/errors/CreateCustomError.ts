export function createCustomError(code: number, description: string) {
  return class CustomError extends Error {
    public code: number;
    constructor(message?: string) {
      super(description);
      this.name = "CustomError";
      this.code = code;
      if(message)
      this.message = message
    }
  };
}

export const UnauthorizedError = createCustomError(401, "Unauthorized");
export const ConflictError = createCustomError(409, "Conflict");
export const ForbiddenError = createCustomError(403, "Forbidden");
export const NotFoundError = createCustomError(404, "Not Found");
export const BadRequestError = createCustomError(400, "Bad Request");