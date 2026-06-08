"use client";

import { useState, useEffect } from "react";
import VideosComponent from "./components/videos";
import { Video } from "./helpers/videoDB";
import { useGet } from "./hooks/useRequest";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);

  const { get } = useGet();

  useEffect(() => {
    get("/api/videos/approved", {
      onSuccess: (data: any[]) => {
        const approved: Video[] = data;
        setVideos([...approved]);
      },
      onError: (error) => {
        console.error("Failed to fetch approved videos:", error);
      },
    });
  }, []);

  return <VideosComponent videos={videos} />;
}
