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
  RATE_LIMIT: "RATE_LIMIT",
} as const;

export type ApiErrorCodeType = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

// ============================================================================
// Mensajes (todo en español, mostrados al usuario)
// ============================================================================

export const USER_MESSAGES: Record<ApiErrorCodeType, string> = {
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
  [ApiErrorCode.RATE_LIMIT]:
    "Has alcanzado el límite de intentos. Intenta más tarde.",
};

/** Mensajes literales del backend → código interno de la app. */
export const BACKEND_MESSAGE_TO_CODE: Record<string, ApiErrorCodeType> = {
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
  "ThrottlerException: Too Many Requests": ApiErrorCode.RATE_LIMIT,
};

export const STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: USER_MESSAGES[ApiErrorCode.VALIDATION_ERROR],
  401: "Credenciales o código incorrectos.",
  403: USER_MESSAGES[ApiErrorCode.USER_NOT_VERIFIED],
  404: "No encontramos la información solicitada.",
  409: "La operación no puede completarse en este momento.",
  429: USER_MESSAGES[ApiErrorCode.RATE_LIMIT],
  422: USER_MESSAGES[ApiErrorCode.VALIDATION_ERROR],
  500: USER_MESSAGES[ApiErrorCode.SERVER_ERROR],
};
