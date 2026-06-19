import axios, { type AxiosRequestConfig } from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await httpClient.get<T>(url, config);
    return response.data;
  },
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await httpClient.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await httpClient.put<T>(url, data, config);
    return response.data;
  },
  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const response = await httpClient.patch<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await httpClient.delete<T>(url, config);
    return response.data;
  },
};

export const authApi = {
  login: async <T>(email: string, password: string) => {
    const response = await httpClient.post<T>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },
  register: async <T>(data: unknown) => {
    const response = await httpClient.post<T>("/auth/register", data);
    return response.data;
  },
};
