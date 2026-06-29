import axios from "axios";

// ============================================================================
// Códigos de error de la aplicación
// ============================================================================

export const ApiErrorCode = {
  USER_NOT_VERIFIED: "USER_NOT_VERIFIED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_EXISTS: "USER_EXISTS",
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  CODE_NOT_REQUESTED: "CODE_NOT_REQUESTED",
  INVALID_CODE: "INVALID_CODE",
  CODE_EXPIRED: "CODE_EXPIRED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_CONFIRMED: "USER_ALREADY_CONFIRMED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN: "UNKNOWN",
} as const;

export type ApiErrorCodeType = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

// ============================================================================
// Mensajes (todo en español, mostrados al usuario)
// ============================================================================

const USER_MESSAGES: Record<ApiErrorCodeType, string> = {
  [ApiErrorCode.USER_NOT_VERIFIED]: "Tu cuenta no ha sido verificada.",
  [ApiErrorCode.INVALID_CREDENTIALS]: "Email o contraseña incorrectos.",
  [ApiErrorCode.USER_EXISTS]:
    "Ya existe una cuenta registrada con este correo.",
  [ApiErrorCode.EMAIL_NOT_FOUND]:
    "No encontramos una cuenta con ese correo electrónico.",
  [ApiErrorCode.CODE_NOT_REQUESTED]:
    "No hay una solicitud activa para este correo. Solicita un nuevo código.",
  [ApiErrorCode.INVALID_CODE]: "El código ingresado es incorrecto.",
  [ApiErrorCode.CODE_EXPIRED]: "El código ha expirado. Solicita uno nuevo.",
  [ApiErrorCode.USER_NOT_FOUND]: "Usuario no encontrado.",
  [ApiErrorCode.USER_ALREADY_CONFIRMED]: "Tu cuenta ya está verificada.",
  [ApiErrorCode.VALIDATION_ERROR]: "Los datos enviados no son válidos.",
  [ApiErrorCode.NETWORK_ERROR]: "Verifica tu conexión e intenta de nuevo.",
  [ApiErrorCode.TIMEOUT_ERROR]:
    "La solicitud tardó demasiado. Intenta de nuevo.",
  [ApiErrorCode.SERVER_ERROR]:
    "Ocurrió un error en el servidor. Intenta más tarde.",
  [ApiErrorCode.UNKNOWN]: "Ocurrió un error. Intenta de nuevo.",
};

/** Mensajes literales del backend → código interno de la app. */
const BACKEND_MESSAGE_TO_CODE: Record<string, ApiErrorCodeType> = {
  "Invalid credentials": ApiErrorCode.INVALID_CREDENTIALS,
  "Invalid refresh token": ApiErrorCode.INVALID_CREDENTIALS,
  "User already exists": ApiErrorCode.USER_EXISTS,
  "Invalid email": ApiErrorCode.EMAIL_NOT_FOUND,
  "No password recovery or email verification has been requested for this email":
    ApiErrorCode.CODE_NOT_REQUESTED,
  "The code entered is incorrect": ApiErrorCode.INVALID_CODE,
  "The code has expired. Please request a new one": ApiErrorCode.CODE_EXPIRED,
  "User not found": ApiErrorCode.USER_NOT_FOUND,
  "The user is already confirmed.": ApiErrorCode.USER_ALREADY_CONFIRMED,
  "Your account has not been verified. Please check your email.":
    ApiErrorCode.USER_NOT_VERIFIED,
};

const STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: USER_MESSAGES[ApiErrorCode.VALIDATION_ERROR],
  401: "Credenciales o código incorrectos.",
  403: USER_MESSAGES[ApiErrorCode.USER_NOT_VERIFIED],
  404: "No encontramos la información solicitada.",
  409: "La operación no puede completarse en este momento.",
  422: USER_MESSAGES[ApiErrorCode.VALIDATION_ERROR],
  500: USER_MESSAGES[ApiErrorCode.SERVER_ERROR],
};

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
