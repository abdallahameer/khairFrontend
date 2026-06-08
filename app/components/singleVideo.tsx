"use client";

import { useEffect, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AiOutlineMuted as UnmuteIcon } from "react-icons/ai";
import { ImVolumeMute2 as MutedIcon } from "react-icons/im";
import { IoMdMore as MoreIcon } from "react-icons/io";
import { IoCloseOutline as CloseIcon } from "react-icons/io5";
import { LuDownload as DownloadIcon } from "react-icons/lu";
import { Video } from "../helpers/videoDB";
import NoContent from "./noContent";
import { useRouter } from "next/navigation";

interface SingleVideoComponentProps {
  video: Video;
  onClose: () => void;
}

export default function SingleVideoComponent({
  video,
  onClose,
}: SingleVideoComponentProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(false);
  const router = useRouter();

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
  }, [video]);

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

  if (!video) {
    return <NoContent />;
  }

  return (
    <div className="z-50 fixed inset-0 bg-black flex justify-center items-center p-2 sm:p-4">
      <div className="relative flex justify-center items-center gap-3 w-full h-full">
        <div className="relative w-full lg:w-[40%] h-full lg:h-[90vh]">
          <video
            ref={videoRef}
            loop
            playsInline
            muted={muted}
            onClick={handleClick}
            className="h-full w-full object-contain md:h-[90vh] md:rounded-lg md:object-contain cursor-pointer"
          >
            <source src={video.video_url} type="video/mp4" />
          </video>

          <div
            className="z-50 hover:cursor-pointer absolute bottom-20 left-4 text-white"
            onClick={() => router.push(`/profile/${video.user_id}`)}
          >
            <p className="text-white text-3xl md:text-2xl font-bold drop-shadow-lg">
              user name: {video.username}
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white text-2xl sm:text-3xl opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-black/30 rounded-full"
          >
            <CloseIcon />
          </button>

          {!muted ? (
            <UnmuteIcon
              onClick={() => setMuted(true)}
              className="absolute top-3 right-14 sm:top-5 sm:right-16 text-white text-2xl sm:text-3xl opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
          ) : (
            <MutedIcon
              onClick={() => setMuted(false)}
              className="absolute top-3 right-14 sm:top-5 sm:right-16 text-white text-2xl sm:text-3xl opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            />
          )}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="absolute top-3 left-3 sm:top-5 sm:left-5 text-white text-2xl sm:text-3xl opacity-70 hover:opacity-100 transition-opacity p-2 hover:bg-black/30 rounded-full">
                <MoreIcon />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-gray-900 text-white rounded-md shadow-lg p-2 min-w-[150px] border border-gray-700">
              <DropdownMenu.Item
                onClick={() => handleDownload(video.video_url)}
                className="flex gap-2 items-center px-3 py-2 cursor-pointer hover:bg-gray-800 rounded transition-colors text-sm"
              >
                <DownloadIcon className="ml-2" />
                <p>Download</p>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  );
}
