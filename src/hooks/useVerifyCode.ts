import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

const RESEND_COOLDOWN = 60;
const TIMER_KEY = "resend_expires_at";

/** Lee sessionStorage y devuelve los segundos restantes (0 si expiró). */
function getRemainingSeconds(): number {
  const stored = sessionStorage.getItem(TIMER_KEY);
  if (!stored) return 0;
  const remaining = Math.round((Number(stored) - Date.now()) / 1000);
  if (remaining <= 0) {
    sessionStorage.removeItem(TIMER_KEY);
    return 0;
  }
  return remaining;
}

export function useVerifyCode() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [segundos, setSegundos] = useState<number>(() => {
    const rem = getRemainingSeconds();
    return rem > 0 ? rem : RESEND_COOLDOWN;
  });
  const [isTimerActive, setIsTimerActive] = useState<boolean>(
    () => getRemainingSeconds() > 0,
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyCode, resendCode } = useAuth();

  const email = (location.state as { email: string })?.email ?? "";

  // Ofusca el correo para mostrarlo en pantalla
  const obfuscateEmail = (emailStr: string) => {
    if (!emailStr) return "";
    const parts = emailStr.split("@");
    if (parts.length !== 2) return emailStr;
    const [name, domain] = parts;
    if (name.length <= 2) return `${name[0]}*@${domain}`;
    return `${name.slice(0, 2)}******@${domain}`;
  };

  /**
   * Solo inicia el setInterval. No llama setState directamente
   * (el estado ya fue inicializado antes de que corra el efecto).
   */
  const startInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsTimerActive(false);
          sessionStorage.removeItem(TIMER_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /**
   * Arrancar el timer con cuenta regresiva completa (acción del usuario).
   * Aquí sí es válido llamar setState porque es dentro de un handler,
   * no dentro de un efecto.
   */
  const startTimer = useCallback(() => {
    const expiresAt = Date.now() + RESEND_COOLDOWN * 1000;
    sessionStorage.setItem(TIMER_KEY, String(expiresAt));
    setSegundos(RESEND_COOLDOWN);
    setIsTimerActive(true);
    startInterval();
  }, [startInterval]);

  // Al montar: solo arranca el intervalo si el estado ya fue inicializado
  // con un timer activo (sin setState, evita cascading renders).
  useEffect(() => {
    if (getRemainingSeconds() > 0) {
      startInterval();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startInterval]);

  const handleValidate = async () => {
    setLocalError(null);
    setIsLoading(true);
    try {
      await verifyCode(email, value);
      navigate("/auth/reset-password", { state: { email, code: value } });
    } catch (err) {
      setLocalError((err as Error).message || "Error al validar el código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendCode(email);
      setLocalError(null);
      startTimer();
    } catch (error: unknown) {
      setLocalError(
        (error as Error).message || "Error al reenviar, intente de nuevo",
      );
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
