import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://my-worker.mohammad-3db.workers.dev";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000 * 60 * 10,
});

apiClient.interceptors.request.use(
  (config) => {
    const isFormData = config.data instanceof FormData;

    if (!isFormData) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export const fetcher = async (url: string) => {
  const response = await apiClient.get(url);
  return response.data;
};

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};
