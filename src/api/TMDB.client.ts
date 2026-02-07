import { apiRequest } from "./apiService";
import { waitForRateLimit } from "./rateLimiter";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN;

const MAX_REQUESTS = 5;
const INTERVAL_IN_SECONDS = 10;
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const getAuthHeaders = (): Record<string, string> => {
  return {
    Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
  };
}

export const TMDBClient = {
  async get<TResponse = unknown>(path: string) {
    await waitForRateLimit("tmdb", MAX_REQUESTS, INTERVAL_IN_SECONDS);
    return apiRequest<TResponse>(
      TMDB_BASE_URL,
      "GET",
      path,
      undefined,
      getAuthHeaders()
    );
  },

}