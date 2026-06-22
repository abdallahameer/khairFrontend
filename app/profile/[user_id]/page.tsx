"use client";

import SingleVideoComponent from "@/app/components/singleVideo";
import { fetcher, getCurrentUser } from "@/app/helpers/api";
import { UserProfileType, Video, VideoItem } from "@/app/helpers/videoDB";
import { usePost } from "@/app/hooks/useRequest";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import Image from "next/image";

export default function UserProfile({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { post } = usePost();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [videosType, setVideosType] = useState<"videos" | "liked" | "saved">(
    "videos",
  );
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const user = getCurrentUser();
  useEffect(() => {
    params.then(({ user_id }) => setUserId(user_id));
  }, [params]);

  const {
    data: userProfileData,
    isLoading,
    mutate,
  } = useSWR<UserProfileType>(
    userId
      ? `/api/users/${userId}${user?.id ? `?viewer_id=${user.id}` : ""}`
      : null,
    fetcher,
  );

  const { data: savedVideos } = useSWR<Video[]>(
    user?.id ? `/api/users/${user.id}/saved-videos` : null,
    fetcher,
  );

  const { data: likedVideos } = useSWR<VideoItem[]>(
    user?.id ? `/api/users/${user.id}/liked-videos` : null,
    fetcher,
  );

  const videosToDisplay = useMemo(() => {
    if (videosType === "videos") return userProfileData?.videos || [];
    if (videosType === "liked") return likedVideos || [];
    if (videosType === "saved") return savedVideos || [];
    return [];
  }, [videosType, userProfileData?.videos, likedVideos, savedVideos]);

  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser?.id === userId;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("user_id", currentUser.id);

      await post("/api/users/upload-profile-image", formData);
      mutate();
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (!videosToDisplay) return;

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
  }, [videosToDisplay]);

  if (!userId || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!userProfileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-white">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-full px-4 pt-8 pb-6">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            {userProfileData.user.profile_image ? (
              <Image
                src={userProfileData.user.profile_image}
                alt={userProfileData.user.username}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full border-2 border-gray-700 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800">
                <span className="text-3xl text-gray-400">
                  {userProfileData.user.username[0].toUpperCase()}
                </span>
              </div>
            )}

            {isOwnProfile && (
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 transition hover:bg-red-700 disabled:opacity-50"
              >
                {uploadingImage ? (
                  <span className="text-xs text-white">...</span>
                ) : (
                  <span className="text-lg leading-none text-white">+</span>
                )}
              </button>
            )}
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">
            @{userProfileData.user.username}
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Joined{" "}
            {new Date(userProfileData.user.created_at).toLocaleDateString()}
          </p>
        </div>

        {!isOwnProfile && (
          <div className="mb-6 flex gap-3">
            <button className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700">
              Follow
            </button>
            <button className="flex-1 rounded-lg bg-gray-800 px-4 py-2 font-bold text-white transition hover:bg-gray-700">
              Message
            </button>
          </div>
        )}
      </div>
      {isOwnProfile ? (
        <div className="flex w-full justify-between border-t px-4">
          <div
            className={`flex w-full justify-center gap-8 px-4 py-2 text-xl font-bold ${videosType === "videos" ? "border-b border-white" : ""}`}
          >
            <p
              onClick={() => setVideosType("videos")}
              className="cursor-pointer text-xl font-bold transition duration-300 hover:text-gray-300"
            >
              videos
            </p>
          </div>
          <div
            className={`flex w-full justify-center gap-8 px-4 py-2 text-xl font-bold ${videosType === "liked" ? "border-b border-white" : ""}`}
          >
            <p
              onClick={() => setVideosType("liked")}
              className="cursor-pointer text-xl font-bold transition duration-300 hover:text-gray-300"
            >
              liked
            </p>
          </div>
          <div
            className={`flex w-full justify-center gap-8 px-4 py-2 ${videosType === "saved" ? "border-b border-white" : ""}`}
          >
            <p
              onClick={() => setVideosType("saved")}
              className="cursor-pointer text-xl font-bold transition duration-300 hover:text-gray-300"
            >
              saved
            </p>
          </div>
        </div>
      ) : null}

      <div className="px-4 pt-2 pb-8">
        {videosToDisplay.length === 0 ? (
          <p className="text-center text-gray-400">No videos yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {videosToDisplay.map((video, index) => (
              <div
                key={video.id}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-900"
                onClick={() => setSelectedVideo(video.id as string)}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source src={video.video_url} type="video/mp4" />
                </video>

                <div className="bg-opacity-0 group-hover:bg-opacity-40 absolute inset-0 flex items-center justify-center transition group-hover:bg-black">
                  <svg
                    className="h-12 w-12 text-white opacity-0 transition group-hover:opacity-100"
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
          videoId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          userId={userId}
        />
      )}
    </div>
  );
}
