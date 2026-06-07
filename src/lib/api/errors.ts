export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR"
  | "NETWORK";

interface BackendErrorBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
  };
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export function parseApiError(
  status: number,
  body: unknown,
  fallbackMessage = "Request failed",
): ApiError {
  const parsed = body as BackendErrorBody | null;
  const code =
    (parsed?.error?.code as ApiErrorCode | undefined) ??
    "INTERNAL_SERVER_ERROR";
  const message = parsed?.error?.message ?? fallbackMessage;

  const statusToCode: Partial<Record<number, ApiErrorCode>> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "UNPROCESSABLE",
    429: "TOO_MANY_REQUESTS",
  };

  return new ApiError(statusToCode[status] ?? code, message, status);
}

export function networkError(message = "Network request failed"): ApiError {
  return new ApiError("NETWORK", message, 0);
}
