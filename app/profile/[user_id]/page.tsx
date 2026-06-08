"use client";

import SingleVideoComponent from "@/app/components/singleVideo";
import { apiClient } from "@/app/helpers/api";
import { Video } from "@/app/helpers/videoDB";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

interface UserProfile {
  user: {
    id: string;
    username: string;
    created_at: string;
  };
  videos: {
    id: string;
    video_url: string;
    uploaded_at: string;
  }[];
}

const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);

export default function UserProfile({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    params.then(({ user_id }) => setUserId(user_id));
  }, [params]);

  const { data, isLoading } = useSWR<UserProfile>(
    userId ? `/api/users/${userId}` : null,
    fetcher,
  );

  useEffect(() => {
    if (!data) return;

    const observers: IntersectionObserver[] = [];

    videoRefs.current.forEach((video) => {
      if (!video) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(video);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [data]);

  if (!userId || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-full px-4 pt-8 pb-6">
        <div className="w-24 h-24 rounded-full bg-gray-800 mb-4 mx-auto"></div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">@{data.user.username}</h2>
          <p className="text-gray-400 text-sm mt-1">
            Joined {new Date(data.user.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Follow
          </button>
          <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Message
          </button>
        </div>
      </div>

      <div className="px-4 pt-2 pb-8">
        {data.videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {data.videos.map((video, index) => (
              <div
                key={video.id}
                className="relative bg-gray-900 rounded-lg overflow-hidden aspect-square group cursor-pointer"
                onClick={() =>
                  setSelectedVideo({
                    ...video,
                    username: data.user.username,
                    user_id: data.user.id,
                  })
                }
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={video.video_url} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedVideo && (
        <SingleVideoComponent
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
