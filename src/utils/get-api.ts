import { STORAGE_KEYS } from "@/constants/storage-keys";
import axios from "axios";

export function getAPI() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  const api = axios.create({
    baseURL: "http://localhost:3000/api", // URL da API (mock)
    timeout: 10000,
  });

  // Interceptador para adicionar token automaticamente
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Interceptador para tratar erros de autenticação
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = "/entrar";
      }
      return Promise.reject(error);
    }
  );

  return { api };
}
