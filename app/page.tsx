"use client";

import { useEffect, useRef, useState } from "react";
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { AiOutlineMuted as UnmuteIcon } from "react-icons/ai";
import { ImVolumeMute2 as MutedIcon } from "react-icons/im";

const Videos = [
  { id: 1, video: "/Quran/quranvideo1.mp4" },
  { id: 2, video: "/Quran/quranvideo2.mp4" },
  { id: 3, video: "/Quran/quranvideo3.mp4" },
  { id: 4, video: "/Quran/quranvideo4.mp4" },
];

export default function Home() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [muted, setMuted] = useState(true);
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
        { threshold: 0.7 }, // 70% visible = play
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

  const handleLike = (id: number) => {
    const newLiked = new Set(likedVideos);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedVideos(newLiked);
  };

  return (
    <div className="h-dvh overflow-y-scroll snap-y snap-mandatory bg-black">
      {Videos.map((item, index) => (
        <div
          key={item.id}
          className="h-dvh snap-start flex justify-center items-center bg-black relative"
        >
          <div className="relative flex justify-center items-center gap-3 w-full h-full">
            {/* Icons Sidebar */}
            <div className=" flex flex-col gap-5 z-10">
              {/* Like Button */}
              <div className="flex flex-col items-center gap-1">
                <button
                  className={`w-12 h-12 rounded-full flex justify-center items-center transition-all duration-300 text-2xl backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer ${
                    likedVideos.has(item.id)
                      ? "bg-white/10 text-red-500"
                      : "bg-white/10 text-white"
                  }`}
                  onClick={() => handleLike(item.id)}
                >
                  {likedVideos.has(item.id) ? <FaHeart /> : <FiHeart />}
                </button>
                <span className="text-xs text-white text-center w-12 whitespace-nowrap overflow-hidden text-ellipsis">
                  Like
                </span>
              </div>

              {/* Comment Button */}
              <div className="flex flex-col items-center gap-1">
                <button className="w-12 h-12 rounded-full flex justify-center items-center bg-white/10 text-white text-2xl transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer">
                  <FiMessageCircle />
                </button>
                <span className="text-xs text-white text-center w-12 whitespace-nowrap overflow-hidden text-ellipsis">
                  Comment
                </span>
              </div>

              {/* Share Button */}
              <div className="flex flex-col items-center gap-1">
                <button className="w-12 h-12 rounded-full flex justify-center items-center bg-white/10 text-white text-2xl transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer">
                  <FiShare2 />
                </button>
                <span className="text-xs text-white text-center w-12 whitespace-nowrap overflow-hidden text-ellipsis">
                  Share
                </span>
              </div>

              {/* Bookmark Button */}
              <div className="flex flex-col items-center gap-1">
                <button className="w-12 h-12 rounded-full flex justify-center items-center bg-white/10 text-white text-2xl transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer">
                  <FiBookmark />
                </button>
                <span className="text-xs text-white text-center w-12 whitespace-nowrap overflow-hidden text-ellipsis">
                  Save
                </span>
              </div>
            </div>
            <div className="relative w-[25%]">
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                loop
                playsInline
                muted={muted}
                onClick={() => handleClick(index)}
                className="h-[90vh] w-full rounded-lg cursor-pointer"
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
