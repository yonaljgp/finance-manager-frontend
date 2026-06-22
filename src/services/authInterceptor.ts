import { httpClient } from "./httpClient";

const authRoutes = [
  "/auth/login",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/verify-email",
  "/auth/register",
  "/auth/logout",
];

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
      .post("/auth/refresh", {}, { withCredentials: true })
      .then((res) => {
        const newAccessToken = extractAccessToken(res.data);
        console.log("refresh");
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
      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${globalAccessToken}`);
      } else {
        config.headers.Authorization = `Bearer ${globalAccessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de RESPONSE: maneja el 401 y el refresh
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (!prevRequest) return Promise.reject(error);

    const isAuthRoute = authRoutes.some((route) =>
      prevRequest.url?.includes(route),
    );

    if (error?.response?.status === 401 && !prevRequest?.sent) {
      // Si la petición que falló fue el propio refresh, no intentamos refrescar de nuevo
      if (isAuthRoute) {
        globalAccessToken = null;
        if (onSessionExpiredCallback) onSessionExpiredCallback();
        return Promise.reject(error);
      }

      // Obtener el token que se usó en esta petición
      const authHeader =
        prevRequest.headers?.Authorization ||
        (typeof prevRequest.headers?.get === "function"
          ? prevRequest.headers.get("Authorization")
          : undefined);

      // Si ya tenemos un token global diferente del que usó esta petición,
      // significa que otra petición ya hizo el refresh con éxito.
      // Reintentamos directamente con el nuevo token sin refrescar otra vez.
      if (globalAccessToken && authHeader !== `Bearer ${globalAccessToken}`) {
        prevRequest.sent = true;
        if (prevRequest.headers) {
          if (typeof prevRequest.headers.set === "function") {
            prevRequest.headers.set(
              "Authorization",
              `Bearer ${globalAccessToken}`,
            );
          } else {
            prevRequest.headers.Authorization = `Bearer ${globalAccessToken}`;
          }
        }
        return httpClient(prevRequest);
      }

      prevRequest.sent = true;

      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          if (typeof prevRequest.headers.set === "function") {
            prevRequest.headers.set(
              "Authorization",
              `Bearer ${newAccessToken}`,
            );
          } else {
            prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return httpClient(prevRequest);
        } else {
          throw new Error("No token returned");
        }
      } catch (refreshError) {
        globalAccessToken = null;
        if (onSessionExpiredCallback) onSessionExpiredCallback();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
