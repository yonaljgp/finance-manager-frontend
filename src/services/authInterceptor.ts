import { httpClient } from "./httpClient";

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/refresh-token",
  "/auth/register",
  "/auth/logout",
  "/auth/email/send-code",
  "/auth/email/confirm",
  "/auth/password/forgot",
  "/auth/password/forgot/resend",
  "/auth/password/verify-code",
  "/auth/password/reset",
] as const;

const isAuthRoute = (url?: string): boolean =>
  !!url && AUTH_ROUTES.some((route) => url.includes(route));

type AuthHeaders = Record<string, unknown> & {
  set?: (name: string, value: string) => void;
  Authorization?: string;
};

const setAuthHeader = (headers: AuthHeaders, token: string): void => {
  if (typeof headers.set === "function") {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.Authorization = `Bearer ${token}`;
  }
};

const getAuthHeader = (headers: AuthHeaders): string | undefined => {
  if (typeof headers.get === "function") {
    return headers.get("Authorization") ?? undefined;
  }
  return headers.Authorization;
};

let globalAccessToken: string | null = null;
let refreshTask: Promise<string> | null = null;
let onSessionExpiredCallback: (() => void) | null = null;

// Función para extraer recursivamente o del subobjeto data si el backend lo anida
export const extractAccessToken = (data: unknown): string | null => {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;

  if (typeof record.access_token === "string") return record.access_token;
  if (typeof record.accessToken === "string") return record.accessToken;

  if (record.data && typeof record.data === "object") {
    return extractAccessToken(record.data);
  }

  return null;
};

export const setGlobalAccessToken = (token: string | null) => {
  globalAccessToken = token;
};

export const getGlobalAccessToken = () => globalAccessToken;

export const setOnSessionExpiredCallback = (callback: (() => void) | null) => {
  onSessionExpiredCallback = callback;
};

export const refreshAccessToken = (): Promise<string> => {
  if (!refreshTask) {
    refreshTask = httpClient
      .post("/auth/refresh-token", {}, { withCredentials: true })
      .then((res) => {
        const newAccessToken = extractAccessToken(res.data);
        if (!newAccessToken)
          throw new Error("El refresh no devolvió access token");
        globalAccessToken = newAccessToken;
        return newAccessToken;
      })
      .finally(() => {
        refreshTask = null;
      });
  }
  return refreshTask;
};

// Interceptor de REQUEST: inyecta el token en cada petición
httpClient.interceptors.request.use(
  (config) => {
    if (globalAccessToken) {
      setAuthHeader(config.headers as AuthHeaders, globalAccessToken);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de RESPONSE: maneja el 401 y el refresh
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config as
      | (typeof error.config & { sent?: boolean; headers?: AuthHeaders })
      | undefined;
    if (!prevRequest) return Promise.reject(error);

    if (error?.response?.status !== 401 || prevRequest.sent) {
      return Promise.reject(error);
    }

    // No intentamos refrescar si la propia ruta de auth fue la que falló.
    if (isAuthRoute(prevRequest.url)) {
      globalAccessToken = null;
      return Promise.reject(error);
    }

    const authHeader = getAuthHeader(prevRequest.headers ?? {});

    // Si ya hay un token global distinto al de esta petición, otra petición
    // refrescó por nosotros: reintentamos directamente con el nuevo.
    if (globalAccessToken && authHeader !== `Bearer ${globalAccessToken}`) {
      prevRequest.sent = true;
      if (prevRequest.headers) {
        setAuthHeader(prevRequest.headers, globalAccessToken);
      }
      return httpClient(prevRequest);
    }

    prevRequest.sent = true;

    try {
      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) throw new Error("No token returned");

      if (prevRequest.headers) {
        setAuthHeader(prevRequest.headers, newAccessToken);
      }
      return httpClient(prevRequest);
    } catch (refreshError) {
      globalAccessToken = null;
      onSessionExpiredCallback?.();
      return Promise.reject(refreshError);
    }
  },
);
