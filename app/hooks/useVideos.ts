import useSWR from "swr";
import { fetcher } from "../helpers/api";

export interface PendingVideo {
  id: string;
  video_url: string;
  uploaded_at: string;
}

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
