"use client";

import { useState } from "react";
import useSWR from "swr";
import VideosComponent from "./components/videos";
import { Video } from "./helpers/videoDB";
import { fetcher } from "./helpers/api";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const { data, error, isLoading } = useSWR("/api/videos/approved", fetcher);

  if (data && videos.length === 0) {
    const approved: Video[] = data;
    setVideos([...approved]);
  }

  if (error) {
    console.error("Failed to fetch approved videos:", error);
  }

  return <VideosComponent videos={videos} />;
}
