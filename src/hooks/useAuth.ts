import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api, authApi, httpClient } from "../services/httpClient";
import {
  setGlobalAccessToken,
  getGlobalAccessToken,
  setOnSessionExpiredCallback,
  extractAccessToken,
  refreshAccessToken,
} from "../services/authInterceptor";

interface RegisterData {
  email: string;
  password: string;
}

interface LoginResponse {
  user: string;
  access_token: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message as string;
  }
  return fallback;
};

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    getGlobalAccessToken(),
  );
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

  // Efecto 1: callback de sesion expirada desde el interceptor
  useEffect(() => {
    setOnSessionExpiredCallback(() => {
      updateToken(null);
      navigate("/auth/login");
    });
    return () => {
      setOnSessionExpiredCallback(null);
    };
  }, [navigate, updateToken]);

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

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await authApi.login<LoginResponse>(email, password);
        const token = extractAccessToken(data);
        if (token) {
          updateToken(token);
        } else {
          updateToken(data.access_token);
        }
        return data;
      } catch (err) {
        const message = getErrorMessage(err, "Error al iniciar sesion");
        setError(message);
        throw new Error(message, { cause: err });
      } finally {
        setIsLoading(false);
      }
    },
    [updateToken],
  );

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      return await authApi.register(userData);
    } catch (err) {
      const message = getErrorMessage(err, "Error al registrarse");
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await httpClient.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Error al cerrar sesion", err);
    } finally {
      updateToken(null);
      navigate("/auth/login");
    }
  }, [navigate, updateToken]);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (err) {
      const message = getErrorMessage(err, "Error al enviar el código");
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/verify-code", { email, code });
    } catch (err) {
      console.log(err);
      const axiosError = err as { response?: { status: number } };
      const status = axiosError.response?.status;
      let message;

      if (status === 401) {
        message = "Tu sesión ha expirado o el código no es válido.";
      } else if (status === 404) {
        message = "Intente nuevamente";
        setTimeout(() => {
          navigate("/auth/forgot-password");
        }, 2000);
      } else {
        message = getErrorMessage(err, "Código inválido o expirado");
      }
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async (email: string, code: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await api.post("/auth/reset-password", { email, code, password });
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Error al restablecer la contraseña",
        );
        setError(message);
        throw new Error(message, { cause: err });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  const resendCode = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/resend-code", { email });
    } catch (err) {
      const message = getErrorMessage(err, "Error al reenviar el código");
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    accessToken,
    isAuth,
    isLoading,
    isBootstrapping,
    error,
    login,
    register,
    logout,
    forgotPassword,
    verifyCode,
    resetPassword,
    resendCode,
  };
};

export { api };
