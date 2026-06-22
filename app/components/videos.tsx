"use client";

import { useEffect, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AiOutlineMuted as UnmuteIcon } from "react-icons/ai";
import { ImVolumeMute2 as MutedIcon } from "react-icons/im";
import { IoMdMore as MoreIcon } from "react-icons/io";
import {
  LuDownload as DownloadIcon,
  LuEye,
  LuLink2,
  LuPlus,
} from "react-icons/lu";
import { FaHeart, FaBookmark, FaComment } from "react-icons/fa";
import { Video } from "../helpers/videoDB";
import NoContent from "./noContent";
import { useRouter } from "next/navigation";
import { apiClient, fetcher, getCurrentUser } from "../helpers/api";
import CommentsPanel from "./commentsPanel";
import { usePost } from "../hooks/useRequest";
import Image from "next/image";
import useSWR from "swr";

export default function VideosComponent({}) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const viewedRef = useRef<Set<string>>(new Set());
  const [muted, setMuted] = useState(false);
  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null);

  const router = useRouter();
  const { post } = usePost();

  const user = getCurrentUser();

  const { data: videos, mutate } = useSWR<Video[]>(
    user?.id
      ? `/api/videos/approved?user_id=${user.id}`
      : `/api/videos/approved`,
    fetcher,
  );

  const recordView = async (videoId: string) => {
    if (!user) return;

    try {
      post(`/api/videos/${videoId}/view`, { user_id: user.id });
    } catch (err) {
      console.error("Failed to record view:", err);
    }
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      const item = videos[index];

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play();

            setCommentsOpenFor((current) => {
              if (current !== null) return item.id.toString();
              return current;
            });

            const timer = setTimeout(() => {
              if (!video.paused && !viewedRef.current.has(item.id.toString())) {
                recordView(item.id.toString());
                viewedRef.current.add(item.id.toString());
              }
            }, 5000);

            video.dataset.viewTimer = String(timer);
          } else {
            video.pause();
            if (video.dataset.viewTimer) {
              clearTimeout(Number(video.dataset.viewTimer));
            }
          }
        },
        { threshold: 0.7 },
      );

      observer.observe(video);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [videos]);

  const handleClick = (index: number) => {
    const video = videoRefs.current[index];
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
    if (!user) {
      alert("You need to login first");
      return;
    }

    try {
      if (item.is_liked) {
        await apiClient.delete(`/api/videos/${item.id}/like`, {
          data: { user_id: user.id },
        });
      } else {
        await post(`/api/videos/${item.id}/like`, {
          user_id: user.id,
        });
      }
      mutate();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleSave = async (item: Video) => {
    if (!user) {
      alert("You need to login first");
      return;
    }

    try {
      if (item.is_saved) {
        await apiClient.delete(`/api/videos/${item.id}/save`, {
          data: { user_id: user.id },
        });
      } else {
        post(`/api/videos/${item.id}/save`, {
          user_id: user.id,
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

  return (
    <div className="h-dvh snap-y snap-mandatory overflow-y-scroll bg-black">
      {videos && videos.length > 0 ? (
        videos.map((item, index) => (
          <div
            key={item.id}
            className="relative flex h-dvh snap-start items-center justify-center bg-black p-2 sm:p-4"
          >
            <div className="relative flex h-full w-full items-center justify-center gap-3">
              <div className="absolute bottom-37.5 left-3 z-50 flex flex-col items-center gap-5 md:relative md:right-0 md:bottom-0 md:mr-3">
                <div className="relative">
                  <div
                    onClick={() => router.push(`/profile/${item.user_id}`)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800"
                  >
                    {item.profile_image ? (
                      <Image
                        src={item.profile_image}
                        alt={item.username}
                        width={90}
                        height={90}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800">
                        <span className="text-3xl text-gray-400">
                          {item.username[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute top-7.5 left-2.25 rounded-full bg-red-500 p-1">
                    <LuPlus className="text-sm" />
                  </div>
                </div>

                <div
                  onClick={() => handleLike(item)}
                  className="flex cursor-pointer flex-col items-center justify-end md:gap-2"
                >
                  <div className="flex cursor-pointer items-center gap-5 rounded-full bg-transparent transition-colors duration-200 hover:bg-gray-600 md:bg-gray-800/50 md:p-3">
                    <button className="flex flex-col items-center justify-end gap-1">
                      <FaHeart
                        className={`text-xl ${item.is_liked ? "text-red-500" : "text-white"} transition-colors duration-200`}
                      />
                    </button>
                  </div>
                  <span className="text-xs text-white">{item.likes_count}</span>
                </div>

                <div className="flex flex-col items-center justify-end md:gap-2">
                  <div className="flex cursor-default items-center gap-5 rounded-full bg-transparent md:bg-gray-800/50 md:p-3">
                    <LuEye className="text-xl text-white" />
                  </div>
                  <span className="text-xs text-white">{item.views_count}</span>
                </div>

                <div className="flex cursor-pointer flex-col items-center justify-end md:gap-2">
                  <div className="flex cursor-pointer items-center gap-5 rounded-full bg-transparent transition-colors duration-200 hover:bg-gray-600 md:bg-gray-800/50 md:p-3">
                    <button
                      onClick={() => {
                        if (!commentsOpenFor) {
                          setCommentsOpenFor(item.id.toString());
                        } else {
                          setCommentsOpenFor(null);
                        }
                      }}
                      className="flex flex-col items-center justify-end gap-1"
                    >
                      <FaComment className="text-xl text-white" />
                    </button>
                  </div>
                  <span className="text-xs text-white">
                    {item.comments_count}
                  </span>
                </div>

                <div className="flex cursor-pointer flex-col items-center justify-end md:gap-2">
                  <div className="flex cursor-pointer items-center gap-5 rounded-full bg-transparent transition-colors duration-200 hover:bg-gray-600 md:bg-gray-800/50 md:p-3">
                    <button
                      onClick={() => handleSave(item)}
                      className="flex flex-col items-center gap-1"
                    >
                      <FaBookmark
                        className={`text-xl ${item.is_saved ? "text-yellow-400" : "text-white"} transition-colors duration-200`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex cursor-pointer flex-col items-center md:gap-2">
                  <div className="flex cursor-pointer items-center gap-5 rounded-full bg-transparent p-3 transition-colors duration-200 hover:bg-gray-600 md:bg-gray-800/50">
                    <button
                      onClick={() => handleCopyLink(item.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <LuLink2 className="rotate-45 text-xl text-white" />
                    </button>
                  </div>
                  <span className="md:blocktext-xs hidden text-white">
                    Share
                  </span>
                </div>
              </div>
              <div className="relative h-full w-full lg:h-[90vh] lg:w-[40%]">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  loop
                  playsInline
                  muted={muted}
                  onClick={() => handleClick(index)}
                  className="h-full w-full cursor-pointer object-contain md:h-[90vh] md:rounded-lg md:object-contain"
                >
                  <source src={item.video_url} type="video/mp4" />
                </video>

                <div
                  className="absolute bottom-20 left-4 z-50 text-white hover:cursor-pointer"
                  onClick={() => router.push(`/profile/${item.user_id}`)}
                >
                  <p className="text-3xl font-bold text-white drop-shadow-lg md:text-2xl">
                    @{item.username}
                  </p>
                </div>

                {!muted ? (
                  <UnmuteIcon
                    onClick={() => setMuted(true)}
                    className="absolute top-3 right-3 cursor-pointer text-2xl text-white opacity-70 transition-opacity hover:opacity-100 sm:top-5 sm:right-5 sm:text-3xl"
                  />
                ) : (
                  <MutedIcon
                    onClick={() => setMuted(false)}
                    className="absolute top-3 right-3 cursor-pointer text-2xl text-white opacity-70 transition-opacity hover:opacity-100 sm:top-5 sm:right-5 sm:text-3xl"
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
                      onClick={() => handleDownload(item.video_url)}
                      className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm transition-colors hover:bg-gray-800"
                    >
                      <DownloadIcon className="ml-2" />
                      <p>Download</p>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        ))
      ) : (
        <NoContent />
      )}

      {commentsOpenFor && (
        <CommentsPanel
          videoId={commentsOpenFor}
          onClose={() => setCommentsOpenFor(null)}
        />
      )}
    </div>
  );
}
