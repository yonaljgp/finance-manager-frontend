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
  const [user, setUser] = useState<string | null>(null);
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
      setUser(null);
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
        setUser(data.user);
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
      setUser(null);
      navigate("/auth/login");
    }
  }, [navigate, updateToken]);

  return {
    user,
    accessToken,
    isAuth,
    isLoading,
    isBootstrapping,
    error,
    login,
    register,
    logout,
  };
};

export { api };
