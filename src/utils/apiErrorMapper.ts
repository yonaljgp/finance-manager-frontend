import axios from "axios";
import {
  ApiErrorCode,
  type ApiErrorCodeType,
  BACKEND_MESSAGE_TO_CODE,
  USER_MESSAGES,
  STATUS_MESSAGES,
} from "./errorMessages";

//export default ApiErrorCode;
export { ApiErrorCode } from "./errorMessages";

// ============================================================================
// Tipos públicos
// ============================================================================

export interface ParsedApiError {
  code: ApiErrorCodeType;
  message: string;
  status?: number;
}

// ============================================================================
// Clase de error personalizada
// ============================================================================

export class AppError extends Error {
  readonly code: ApiErrorCodeType;
  readonly status?: number;

  constructor(parsed: ParsedApiError, cause?: unknown) {
    super(parsed.message);
    this.name = "AppError";
    this.code = parsed.code;
    this.status = parsed.status;
    if (cause !== undefined) {
      this.cause = cause;
    }
  }
}

// ============================================================================
// Helpers internos
// ============================================================================

interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[] | { message?: string; code?: string };
  code?: string;
}

interface NormalizedBody {
  explicitCode?: string;
  backendMessage?: string;
}

function isApiErrorCode(value: string): value is ApiErrorCodeType {
  return value in USER_MESSAGES;
}

/**
 * Normaliza la estructura heterogénea del body de error en una tupla
 * `(explicitCode, backendMessage)` que consume `resolveCode`.
 */
function normalizeBody(data: unknown): NormalizedBody {
  if (!data || typeof data !== "object") {
    return {};
  }

  const body = data as ApiErrorBody;

  // Arrays de validación se manejan aparte en parseApiError.
  if (Array.isArray(body.message)) {
    return {};
  }

  if (typeof body.message === "string") {
    return { explicitCode: body.code, backendMessage: body.message };
  }

  if (body.message && typeof body.message === "object") {
    return {
      explicitCode: body.message.code ?? body.code,
      backendMessage: body.message.message,
    };
  }

  return { explicitCode: body.code };
}

function resolveCode(
  explicitCode: string | undefined,
  backendMessage: string | undefined,
  status: number | undefined,
): ApiErrorCodeType {
  if (explicitCode && isApiErrorCode(explicitCode)) {
    return explicitCode;
  }

  if (backendMessage) {
    const fromMessage = BACKEND_MESSAGE_TO_CODE[backendMessage];
    if (fromMessage) {
      return fromMessage;
    }
  }

  if (status !== undefined && status >= 500) {
    return ApiErrorCode.SERVER_ERROR;
  }

  return ApiErrorCode.UNKNOWN;
}

function resolveMessage(
  code: ApiErrorCodeType,
  status: number | undefined,
  fallback: string | undefined,
): string {
  if (code !== ApiErrorCode.UNKNOWN) {
    return USER_MESSAGES[code];
  }

  if (status !== undefined) {
    const statusMessage = STATUS_MESSAGES[status];
    if (statusMessage) {
      return statusMessage;
    }
  }

  return fallback ?? USER_MESSAGES[ApiErrorCode.UNKNOWN];
}

// ============================================================================
// API pública
// ============================================================================

/**
 * Convierte cualquier error (típicamente de Axios) en un objeto con
 * código tipado y mensaje legible para el usuario.
 */
export function parseApiError(
  error: unknown,
  fallback?: string,
): ParsedApiError {
  if (!axios.isAxiosError(error)) {
    return {
      code: ApiErrorCode.UNKNOWN,
      message: fallback ?? USER_MESSAGES[ApiErrorCode.UNKNOWN],
    };
  }

  // Sin respuesta: red caída o timeout.
  if (!error.response) {
    const code =
      error.code === "ECONNABORTED"
        ? ApiErrorCode.TIMEOUT_ERROR
        : ApiErrorCode.NETWORK_ERROR;
    return { code, message: USER_MESSAGES[code] };
  }

  const status = error.response.status;
  const body = error.response.data as ApiErrorBody | undefined;

  // Errores de validación: NestJS devuelve `message` como array.
  if (body && Array.isArray(body.message)) {
    return {
      code: ApiErrorCode.VALIDATION_ERROR,
      message: USER_MESSAGES[ApiErrorCode.VALIDATION_ERROR],
      status,
    };
  }

  const { explicitCode, backendMessage } = normalizeBody(body);
  const code = resolveCode(explicitCode, backendMessage, status);
  const message = resolveMessage(code, status, fallback);

  return { code, message, status };
}

/** Convierte un error desconocido en un `AppError` con código y mensaje. */
export function toAppError(error: unknown, fallback?: string): AppError {
  return new AppError(parseApiError(error, fallback), error);
}
