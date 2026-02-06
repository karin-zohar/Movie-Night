import { apiRequest } from "./apiService";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN;

const getAuthHeaders = (): Record<string, string> => {
  return {
    Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
  };
}

export const TMDBClient = {
  get<TResponse = unknown>(path: string) {
    return apiRequest<TResponse>(
      TMDB_BASE_URL,
      "GET",
      `${path}${path.includes("?") ? "&" : "?"}`,
      undefined,
      getAuthHeaders()
    );
  },

  post<TResponse = unknown>(path: string, body?: unknown) {
    return apiRequest<TResponse>(
      TMDB_BASE_URL,
      "POST",
      `${path}${path.includes("?") ? "&" : "?"}`,
      body,
      getAuthHeaders()
    );
  },
};
