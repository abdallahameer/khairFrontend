"use client";

import { useEffect, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { AiOutlineMuted as UnmuteIcon } from "react-icons/ai";
import { ImVolumeMute2 as MutedIcon } from "react-icons/im";
import { IoMdMore as MoreIcon } from "react-icons/io";
import { LuDownload as DownloadIcon } from "react-icons/lu";
const Videos = [
  { id: 1, video: "/Quran/quranvideo1.mp4" },
  { id: 2, video: "/Quran/quranvideo2.mp4" },
  { id: 3, video: "/Quran/quranvideo3.mp4" },
  { id: 4, video: "/Quran/quranvideo4.mp4" },
];

export default function Home() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    videoRefs.current.forEach((video) => {
      if (!video) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        },
        { threshold: 0.7 },
      );

      observer.observe(video);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

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

  return (
    <div className="h-dvh overflow-y-scroll snap-y snap-mandatory bg-black">
      {Videos.map((item, index) => (
        <div
          key={item.id}
          className="h-dvh snap-start flex justify-center items-center bg-black relative"
        >
          <div className="relative flex justify-center items-center gap-3 w-full h-full">
            <div className="relative w-full md:w-[25%] h-full md:h-[90vh]">
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                loop
                playsInline
                muted={muted}
                onClick={() => handleClick(index)}
                className="h-full w-full object-contain md:h-[90vh] md:rounded-lg md:object-contain cursor-pointer"
              >
                <source src={item.video} type="video/mp4" />
              </video>
              {!muted ? (
                <UnmuteIcon
                  onClick={() => setMuted(true)}
                  className="absolute top-5 right-5 text-white text-3xl opacity-70"
                />
              ) : (
                <MutedIcon
                  onClick={() => setMuted(false)}
                  className="absolute top-5 right-5 text-white text-3xl opacity-70"
                />
              )}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="absolute top-5 left-5 text-white text-3xl opacity-70 hover:opacity-100 transition-opacity">
                    <MoreIcon />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-white text-black rounded-md shadow-lg p-2 min-w-[150px]">
                  <DropdownMenu.Item
                    onClick={() => handleDownload(item.video)}
                    className="flex gap-2 items-center px-3 py-2 cursor-pointer hover:bg-gray-200 rounded transition-colors"
                  >
                    <DownloadIcon className="ml-2" />
                    <p>Download Video</p>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
