import { useState, useCallback } from "react";
import axios from "axios";

// Define una interfaz para los datos de registro para evitar 'any'
interface RegisterData {
  email: string;
  password: string;
  // Agrega aquí cualquier otra propiedad que tu API de registro espere
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [accesstoken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(`/auth/login`, { email, password });

      const { user, accessToken } = response.data;

      // Guardar sesión
      if (!isAuth) setIsAuth(true);
      setAccessToken(accessToken);
      setUser(user);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return response.data;
    } catch (error: unknown) {
      let message = "Error al iniciar sesión";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data?.message || message;
      }
      setError(message);
      throw new Error(message, { cause: error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(`/auth/register`, userData);
      return response.data;
    } catch (error: unknown) {
      let message = "Error al registrarse";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data?.message || message;
      }
      setError(message);
      throw new Error(message, { cause: error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await api.post("/auth/logout");
      if (response.status === 200) {
        setIsAuth(false);
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
      }
    } catch (error: unknown) {
      let message = "Error al cerrar sesión";
      if (axios.isAxiosError(error) && error.response) {
        message = `error: ${error.response.data?.message || message}`;
      }
      return message;
    }
  }, []);

  return {
    isAuth,
    user,
    accesstoken,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
