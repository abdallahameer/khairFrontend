"use client";

import React, { createContext, useContext, useState } from "react";
import { Video, PendingVideo } from "../helpers/videoDB";

interface VideoContextType {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  pendingVideos: PendingVideo[];
  setPendingVideos: React.Dispatch<React.SetStateAction<PendingVideo[]>>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const defaultVideos: Video[] = [{ id: 1, video: "/Quran/quranvideo1.mp4" }];

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [pendingVideos, setPendingVideos] = useState<PendingVideo[]>([
    {
      id: 2,
      video: "/Quran/quranvideo2.mp4",
      uploadedAt: new Date().toISOString(),
    },
  ]);

  return (
    <VideoContext.Provider
      value={{ videos, setVideos, pendingVideos, setPendingVideos }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within VideoProvider");
  }
  return context;
}
