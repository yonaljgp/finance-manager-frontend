import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { api, authApi, httpClient } from "../services/httpClient";
import {
  extractAccessToken,
  getGlobalAccessToken,
  refreshAccessToken,
  setGlobalAccessToken,
  setOnSessionExpiredCallback,
} from "../services/authInterceptor";
import {
  ApiErrorCode,
  toAppError,
  type SetError,
} from "../utils/apiErrorMapper";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface RegisterData {
  email: string;
  password: string;
}

interface AuthUser {
  name: string;
  email: string;
}

interface LoginResponse {
  access_token?: string;
  accessToken?: string;
  user?: AuthUser;
}

/** Resultado de una acción: indica éxito y, si falló, el mensaje para mostrar. */
interface ActionResult {
  ok: boolean;
  errorMessage?: string;
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

const USER_STORAGE_KEY = "auth_user";

/**
 * Lee el usuario persistido en localStorage.
 * Devuelve `null` si no existe o si los datos están corruptos.
 */
const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as AuthUser).name === "string" &&
      typeof (parsed as AuthUser).email === "string"
    ) {
      return parsed as AuthUser;
    }
    return null;
  } catch {
    return null;
  }
};

const writeStoredUser = (user: AuthUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {
    // localStorage puede no estar disponible (modo privado, etc.); lo ignoramos.
  }
};

/**
 * Ejecuta una tarea de autenticación con manejo uniforme de:
 *  - estado de carga
 *  - limpieza de error previo
 *  - traducción de errores a mensajes de usuario
 */
async function runAuthTask<T>(
  setIsLoading: (v: boolean) => void,
  setError: SetError,
  fallback: string,
  task: () => Promise<T>,
): Promise<{ ok: boolean; errorMessage?: string }> {
  setIsLoading(true);
  setError(null);
  try {
    await task();
    return { ok: true };
  } catch (err) {
    const appError = toAppError(err, fallback);
    setError(appError.message);
    return { ok: false, errorMessage: appError.message };
  } finally {
    setIsLoading(false);
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    getGlobalAccessToken(),
  );
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isAuth, setIsAuth] = useState<boolean>(!!getGlobalAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const updateToken = useCallback((token: string | null) => {
    setGlobalAccessToken(token);
    setAccessToken(token);
    setIsAuth(!!token);
  }, []);

  /**
   * Único punto de escritura del estado `user`: garantiza que cualquier
   * cambio (login, logout, sesión expirada) se persista en localStorage
   * para que sobreviva a recargas de la página.
   */
  const updateUser = useCallback((next: AuthUser | null) => {
    setUser(next);
    writeStoredUser(next);
  }, []);

  // Reaccionar al evento "sesión expirada" emitido por el interceptor HTTP.
  useEffect(() => {
    setOnSessionExpiredCallback(() => {
      updateToken(null);
      updateUser(null);
      navigate("/auth/login");
    });
    return () => setOnSessionExpiredCallback(null);
  }, [navigate, updateToken, updateUser]);

  // Al montar, intenta renovar el token si existe la cookie de refresh.
  useEffect(() => {
    const bootstrap = async () => {
      if (getGlobalAccessToken()) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const token = await refreshAccessToken();
        if (token) updateToken(token);
      } catch {
        updateToken(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [updateToken]);

  // -------------------------------------------------------------------------
  // Acciones
  // -------------------------------------------------------------------------

  const validateEmail = useCallback(
    async (email: string): Promise<ActionResult> =>
      runAuthTask(setIsLoading, setError, "Error al enviar el código", () =>
        api.post("/auth/email/send-code", { email }),
      ),
    [],
  );

  const confirmEmail = useCallback(
    async (email: string, code: string): Promise<ActionResult> =>
      runAuthTask(setIsLoading, setError, "Error al confirmar la cuenta", () =>
        api.post("/auth/email/confirm", { email, code }),
      ),
    [],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<ActionResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await authApi.login<LoginResponse>(email, password);
        const token = extractAccessToken(data);
        if (!token) {
          const message = "No se pudo obtener el token de acceso.";
          setError(message);
          return { ok: false, errorMessage: message };
        }
        if (data?.user) {
          updateUser(data.user);
        }
        updateToken(token);
        return { ok: true };
      } catch (err) {
        const appError = toAppError(err, "Error al iniciar sesión");

        // Caso especial: cuenta no verificada → enviamos código y navegamos.
        if (appError.code === ApiErrorCode.USER_NOT_VERIFIED) {
          await validateEmail(email);
          navigate("/auth/validate-email", { state: { email } });
          return { ok: false, errorMessage: appError.message };
        }

        setError(appError.message);
        return { ok: false, errorMessage: appError.message };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, updateToken, updateUser, validateEmail],
  );

  const register = useCallback(
    async (userData: RegisterData): Promise<ActionResult> =>
      runAuthTask(setIsLoading, setError, "Error al registrarse", () =>
        authApi.register(userData),
      ),
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await httpClient.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      updateToken(null);
      updateUser(null);
      navigate("/auth/login");
    }
  }, [navigate, updateToken, updateUser]);

  const forgotPassword = useCallback(
    async (email: string): Promise<ActionResult> =>
      runAuthTask(setIsLoading, setError, "Error al enviar el código", () =>
        api.post("/auth/password/forgot", { email }),
      ),
    [],
  );

  const verifyCode = useCallback(
    async (email: string, code: string): Promise<ActionResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await api.post("/auth/password/verify-code", { email, code });
        return { ok: true };
      } catch (err) {
        const appError = toAppError(err, "Código inválido o expirado");

        // Si no hay solicitud previa, dejamos que el usuario lea el mensaje
        // antes de redirigirlo al paso anterior.
        if (appError.code === ApiErrorCode.CODE_NOT_REQUESTED) {
          setError(appError.message);
          setTimeout(() => navigate("/auth/forgot-password"), 2000);
          return { ok: false, errorMessage: appError.message };
        }

        setError(appError.message);
        return { ok: false, errorMessage: appError.message };
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  const resetPassword = useCallback(
    async (
      email: string,
      code: string,
      password: string,
    ): Promise<ActionResult> =>
      runAuthTask(
        setIsLoading,
        setError,
        "Error al restablecer la contraseña",
        () => api.post("/auth/password/reset", { email, code, password }),
      ),
    [],
  );

  const resendCode = useCallback(
    async (endpoint: string, email: string): Promise<ActionResult> =>
      runAuthTask(setIsLoading, setError, "Error al reenviar el código", () =>
        api.post(endpoint, { email }),
      ),
    [],
  );

  // -------------------------------------------------------------------------
  // API pública del hook
  // -------------------------------------------------------------------------

  return {
    accessToken,
    user,
    isAuth,
    isLoading,
    isBootstrapping,
    error,
    login,
    register,
    validateEmail,
    confirmEmail,
    logout,
    forgotPassword,
    verifyCode,
    resetPassword,
    resendCode,
  };
};

export { api };
