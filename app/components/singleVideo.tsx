"use client";

import { useEffect, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AiOutlineMuted as UnmuteIcon } from "react-icons/ai";
import { ImVolumeMute2 as MutedIcon } from "react-icons/im";
import { IoMdMore as MoreIcon } from "react-icons/io";
import { IoCloseOutline as CloseIcon } from "react-icons/io5";
import {
  LuDownload as DownloadIcon,
  LuEye,
  LuLink2,
  LuPlus,
} from "react-icons/lu";
import { Video } from "../helpers/videoDB";
import NoContent from "./noContent";
import { useRouter } from "next/navigation";
import { FaBookmark, FaComment, FaHeart } from "react-icons/fa";
import { apiClient, fetcher } from "../helpers/api";
import { usePost } from "../hooks/useRequest";
import CommentsPanel from "./commentsPanel";
import useSWR from "swr";
import Image from "next/image";

interface SingleVideoComponentProps {
  videoId: string;
  onClose: () => void;
  userId: string;
}

export default function SingleVideoComponent({
  videoId,
  onClose,
  userId,
}: SingleVideoComponentProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null);
  const router = useRouter();
  const { post: postLike } = usePost();
  const { data: videoData, mutate } = useSWR(
    videoId
      ? `/api/videos/${videoId}${userId ? `?viewer_id=${userId}` : ""}`
      : null,
    fetcher,
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      },
      { threshold: 0.7 },
    );

    observer.observe(videoElement);

    return () => observer.disconnect();
  }, [videoData]);

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const handleDownload = (videoUrl: string) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = videoUrl.split("/").pop() || "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLike = async (item: Video) => {
    if (!userId) {
      alert("You need to login first");
      return;
    }

    try {
      if (item.is_liked) {
        await apiClient.delete(`/api/videos/${item.id}/like`, {
          data: { user_id: userId },
        });
      } else {
        await postLike(`/api/videos/${item.id}/like`, {
          user_id: userId,
        });
      }
      mutate();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleSave = async (item: Video) => {
    if (!userId) {
      alert("You need to login first");
      return;
    }

    try {
      if (item.is_saved) {
        await apiClient.delete(`/api/videos/${item.id}/save`, {
          data: { user_id: userId },
        });
      } else {
        postLike(`/api/videos/${item.id}/save`, {
          user_id: userId,
        });
      }
      mutate();
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  const handleCopyLink = (videoId: string | number) => {
    const link = `${window.location.origin}/video/${videoId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  if (!videoData) {
    return <NoContent />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-2 sm:p-4">
      <div className="relative flex h-full w-full items-center justify-center gap-3">
        <div className="absolute bottom-37.5 left-3 z-50 flex flex-col items-center gap-5 md:relative md:right-0 md:bottom-0 md:mr-3">
          <div className="relative">
            <div
              onClick={() => router.push(`/profile/${videoData.user_id}`)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800"
            >
              {videoData.profile_image ? (
                <Image
                  src={videoData.profile_image}
                  alt={videoData.username}
                  width={90}
                  height={90}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800">
                  <span className="text-3xl text-gray-400">
                    {videoData.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="absolute top-7.5 left-2.25 rounded-full bg-red-500 p-1">
              <LuPlus className="text-sm" />
            </div>
          </div>

          <div
            onClick={() => handleLike(videoData)}
            className="flex cursor-pointer flex-col items-center justify-end md:gap-2"
          >
            <div className="flex cursor-pointer items-center gap-5 rounded-full bg-transparent transition-colors duration-200 hover:bg-gray-600 md:bg-gray-800/50 md:p-3">
              <button className="flex flex-col items-center justify-end gap-1">
                <FaHeart
                  className={`text-xl ${videoData?.is_liked ? "text-red-500" : "text-white"} transition-colors duration-200`}
                />
              </button>
            </div>
            <span className="text-xs text-white">{videoData?.likes_count}</span>
          </div>

          <div className="flex flex-col items-center justify-end md:gap-2">
            <div className="flex cursor-default items-center gap-5 rounded-full bg-transparent md:bg-gray-800/50 md:p-3">
              <LuEye className="text-xl text-white" />
            </div>
            <span className="text-xs text-white">{videoData?.views_count}</span>
          </div>

          <div className="flex cursor-pointer flex-col items-center justify-end md:gap-2">
            <div className="flex cursor-pointer items-center gap-5 rounded-full bg-transparent transition-colors duration-200 hover:bg-gray-600 md:bg-gray-800/50 md:p-3">
              <button
                onClick={() => setCommentsOpenFor(videoId)}
                className="flex flex-col items-center justify-end gap-1"
              >
                <FaComment className="text-xl text-white" />
              </button>
            </div>
            <span className="text-xs text-white">
              {videoData?.comments_count}
            </span>
          </div>

          <div className="flex cursor-pointer flex-col items-center justify-end md:gap-2">
            <div className="flex cursor-pointer items-center gap-5 rounded-full bg-transparent transition-colors duration-200 hover:bg-gray-600 md:bg-gray-800/50 md:p-3">
              <button
                onClick={() => handleSave(videoData)}
                className="flex flex-col items-center gap-1"
              >
                <FaBookmark
                  className={`text-xl ${videoData?.is_saved ? "text-yellow-400" : "text-white"} transition-colors duration-200`}
                />
              </button>
            </div>
          </div>

          <div className="flex cursor-pointer flex-col items-center md:gap-2">
            <div className="flex cursor-pointer items-center gap-5 rounded-full bg-transparent p-3 transition-colors duration-200 hover:bg-gray-600 md:bg-gray-800/50">
              <button
                onClick={() => handleCopyLink(videoId)}
                className="flex flex-col items-center gap-1"
              >
                <LuLink2 className="rotate-45 text-xl text-white" />
              </button>
            </div>
            <span className="md:blocktext-xs hidden text-white">Share</span>
          </div>
        </div>
        <div className="relative h-full w-full lg:h-[90vh] lg:w-[40%]">
          <video
            ref={videoRef}
            loop
            playsInline
            muted={muted}
            onClick={handleClick}
            className="h-full w-full cursor-pointer object-contain md:h-[90vh] md:rounded-lg md:object-contain"
          >
            <source src={videoData.video_url} type="video/mp4" />
          </video>

          <div
            className="absolute bottom-20 left-4 z-50 text-white hover:cursor-pointer"
            onClick={() => router.push(`/profile/${videoData.user_id}`)}
          >
            <p className="text-3xl font-bold text-white drop-shadow-lg md:text-2xl">
              user name: {videoData.username}
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full p-1 text-2xl text-white opacity-70 transition-opacity hover:bg-black/30 hover:opacity-100 sm:top-5 sm:right-5 sm:text-3xl"
          >
            <CloseIcon />
          </button>

          {!muted ? (
            <UnmuteIcon
              onClick={() => setMuted(true)}
              className="absolute top-3 right-14 cursor-pointer text-2xl text-white opacity-70 transition-opacity hover:opacity-100 sm:top-5 sm:right-16 sm:text-3xl"
            />
          ) : (
            <MutedIcon
              onClick={() => setMuted(false)}
              className="absolute top-3 right-14 cursor-pointer text-2xl text-white opacity-70 transition-opacity hover:opacity-100 sm:top-5 sm:right-16 sm:text-3xl"
            />
          )}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="absolute top-3 left-3 rounded-full p-2 text-2xl text-white opacity-70 transition-opacity hover:bg-black/30 hover:opacity-100 sm:top-5 sm:left-5 sm:text-3xl">
                <MoreIcon />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="min-w-[150px] rounded-md border border-gray-700 bg-gray-900 p-2 text-white shadow-lg">
              <DropdownMenu.Item
                onClick={() => handleDownload(videoData.video_url)}
                className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm transition-colors hover:bg-gray-800"
              >
                <DownloadIcon className="ml-2" />
                <p>Download</p>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>

      {commentsOpenFor && (
        <CommentsPanel
          videoId={commentsOpenFor}
          onClose={() => setCommentsOpenFor(null)}
        />
      )}
    </div>
  );
}
