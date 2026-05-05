import { useState } from "react";
import { apiClient } from "../helpers/api";

interface UseRequestOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onProgress?: (progress: number) => void;
  headers?: Record<string, string>;
}

/**
 * Generic GET request hook
 * @example
 * const { get, loading, error } = useGet();
 * const data = await get("/api/endpoint");
 */
export function useGet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async (url: string, options?: UseRequestOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(url, {
        headers: options?.headers,
      });

      setLoading(false);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Request failed";
      setError(message);
      setLoading(false);
      options?.onError?.(err);
      throw err;
    }
  };

  return { get, loading, error };
}

/**
 * Generic POST request hook
 * @example
 * const { post, loading, error } = usePost();
 * await post("/api/endpoint", { data: "value" });
 */
export function usePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (url: string, data?: any, options?: UseRequestOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(url, data, {
        headers: options?.headers,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && options?.onProgress) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            options.onProgress(progress);
          }
        },
      });

      setLoading(false);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Request failed";
      setError(message);
      setLoading(false);
      options?.onError?.(err);
      throw err;
    }
  };

  return { post, loading, error };
}

/**
 * Generic PUT request hook
 * @example
 * const { put, loading, error } = usePut();
 * await put("/api/endpoint/123", { updated: "data" });
 */
export function usePut() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const put = async (url: string, data?: any, options?: UseRequestOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(url, data, {
        headers: options?.headers,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && options?.onProgress) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            options.onProgress(progress);
          }
        },
      });

      setLoading(false);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Request failed";
      setError(message);
      setLoading(false);
      options?.onError?.(err);
      throw err;
    }
  };

  return { put, loading, error };
}

/**
 * Generic PATCH request hook
 * @example
 * const { patch, loading, error } = usePatch();
 * await patch("/api/endpoint/123", { field: "updated" });
 */
export function usePatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = async (
    url: string,
    data?: any,
    options?: UseRequestOptions,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch(url, data, {
        headers: options?.headers,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && options?.onProgress) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            options.onProgress(progress);
          }
        },
      });

      setLoading(false);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Request failed";
      setError(message);
      setLoading(false);
      options?.onError?.(err);
      throw err;
    }
  };

  return { patch, loading, error };
}

/**
 * Generic DELETE request hook
 * @example
 * const { delete: deleteRequest, loading, error } = useDelete();
 * await deleteRequest("/api/endpoint/123");
 */
export function useDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRequest = async (url: string, options?: UseRequestOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(url, {
        headers: options?.headers,
      });

      setLoading(false);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Request failed";
      setError(message);
      setLoading(false);
      options?.onError?.(err);
      throw err;
    }
  };

  return { delete: deleteRequest, loading, error };
}
