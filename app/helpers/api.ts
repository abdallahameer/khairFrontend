import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://my-worker.mohammad-3db.workers.dev";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
