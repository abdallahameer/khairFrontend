import useSWR from "swr";
import { apiClient } from "../helpers/api";

export interface PendingVideo {
  id: string;
  video_url: string;
  uploaded_at: string;
}

const fetcher = async (url: string) => {
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Fetch pending videos with SWR
 * Use generic useDelete/usePut/usePost hooks for mutations
 * @example
 * const { videos, isLoading, mutate } = usePendingVideos();
 * // Then use useDelete to delete videos
 * const { delete: deleteRequest } = useDelete();
 * await deleteRequest("/api/videos/123");
 * mutate(); // Revalidate after mutation
 */
export function usePendingVideos() {
  const { data, error, isLoading, mutate } = useSWR<PendingVideo[]>(
    "/api/videos/pending",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    videos: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
