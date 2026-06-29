import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/**
 * Endpoints válidos para reenviar el código. Mantener este union type
 * cerrado evita que un consumidor pase accidentalmente una ruta incorrecta.
 */
export type ResendCodeEndpoint =
  | "/auth/password/forgot"
  | "/auth/password/forgot/resend"
  | "/auth/email/send-code";

/**
 * Tipo de verificación. Determina qué endpoint se llama al validar
 * el código PIN introducido por el usuario.
 */
export type VerifyCodeKind = "email" | "password";

interface VerifyCodeParams {
  /** Tipo de verificación: email (confirmar cuenta) o password (reset). */
  kind: VerifyCodeKind;
  /** Ruta a la que se navega cuando el código es válido. */
  navigateTo: string;
  /** Endpoint al que se llama al pulsar "Reenviar código". */
  fetchTo: ResendCodeEndpoint;
}

// ---------------------------------------------------------------------------
// Constantes del temporizador
// ---------------------------------------------------------------------------

const RESEND_COOLDOWN_SECONDS = 60;
const TIMER_STORAGE_KEY = "resend_expires_at";

/** Lee sessionStorage y devuelve los segundos restantes (0 si expiró). */
function getRemainingSeconds(): number {
  const stored = sessionStorage.getItem(TIMER_STORAGE_KEY);
  if (!stored) return 0;
  const remaining = Math.round((Number(stored) - Date.now()) / 1000);
  if (remaining <= 0) {
    sessionStorage.removeItem(TIMER_STORAGE_KEY);
    return 0;
  }
  return remaining;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Lógica reutilizable para pantallas de verificación de código PIN:
 *  - Recuperación de contraseña (`kind: "password"`)
 *  - Validación de cuenta recién registrada (`kind: "email"`)
 *
 * Devuelve el estado y los handlers que `VerifyCode` necesita.
 */
export function useVerifyCode({ kind, navigateTo, fetchTo }: VerifyCodeParams) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const initialRemaining = getRemainingSeconds();
  const [segundos, setSegundos] = useState<number>(
    initialRemaining > 0 ? initialRemaining : RESEND_COOLDOWN_SECONDS,
  );
  const [isTimerActive, setIsTimerActive] = useState<boolean>(
    initialRemaining > 0,
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyCode, confirmEmail, resendCode } = useAuth();

  const email = (location.state as { email?: string })?.email ?? "";

  /** Ofusca el correo para mostrarlo en pantalla (ej. yo******@gmail.com). */
  const obfuscateEmail = (emailStr: string): string => {
    if (!emailStr) return "";
    const parts = emailStr.split("@");
    if (parts.length !== 2) return emailStr;
    const [name, domain] = parts;
    if (name.length <= 2) return `${name[0]}*@${domain}`;
    return `${name.slice(0, 2)}******@${domain}`;
  };

  // Inicia el setInterval (sin tocar estado: ya fue inicializado en mount).
  const startInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimerActive(false);
          sessionStorage.removeItem(TIMER_STORAGE_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Reinicia la cuenta atrás (acción del usuario: aquí sí hay setState).
  const startTimer = useCallback(() => {
    const expiresAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
    sessionStorage.setItem(TIMER_STORAGE_KEY, String(expiresAt));
    setSegundos(RESEND_COOLDOWN_SECONDS);
    setIsTimerActive(true);
    startInterval();
  }, [startInterval]);

  useEffect(() => {
    if (getRemainingSeconds() > 0) {
      startInterval();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startInterval]);

  /**
   * Llama al endpoint correcto según el `kind`:
   *  - "email"    → /auth/email/confirm   (vía confirmEmail)
   *  - "password" → /auth/password/verify-code (vía verifyCode)
   */
  const validateCode = (): Promise<{ ok: boolean; errorMessage?: string }> =>
    kind === "email" ? confirmEmail(email, value) : verifyCode(email, value);

  const handleValidate = async (): Promise<void> => {
    setLocalError(null);
    setIsLoading(true);
    const result = await validateCode();
    setIsLoading(false);
    if (result.ok) {
      navigate(navigateTo, { state: { email, code: value } });
    } else if (result.errorMessage) {
      setLocalError(result.errorMessage);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    setLocalError(null);
    const result = await resendCode(fetchTo, email);
    if (result.ok) {
      startTimer();
    } else if (result.errorMessage) {
      setLocalError(result.errorMessage);
    }
  };

  return {
    value,
    setValue,
    isLoading,
    localError,
    segundos,
    isTimerActive,
    email,
    obfuscateEmail,
    handleValidate,
    handleResendCode,
  };
}
