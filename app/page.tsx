"use client";

import { useRef } from "react";
import { LuPlus as PlusIcon } from "react-icons/lu";
import VideosComponent from "./components/videos";
import { useVideoContext } from "./context/VideoContext";
import { Video } from "./helpers/videoDB";

const defaultVideos: Video[] = [{ id: 1, video: "/Quran/quranvideo1.mp4" }];

export default function Home() {
  const { videos, setPendingVideos } = useVideoContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    setPendingVideos((prev) => [
      ...prev,
      {
        id: Date.now(),
        video: videoUrl,
        uploadedAt: new Date().toISOString(),
      },
    ]);

    alert("Video uploaded! It is now pending reviewer approval.");
    e.target.value = "";
  };

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex w-[15%] lg:w-[12%] h-full bg-black border-r border-gray-800 flex-col p-3 lg:p-4 items-start py-6 lg:py-8 gap-6 fixed left-0 top-0 z-50">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex gap-2 lg:gap-3 items-center cursor-pointer hover:opacity-80 transition-opacity p-2 hover:bg-gray-900 rounded-lg"
        >
          <div className="bg-transparent w-8 h-8 lg:w-10 lg:h-10 border-2 rounded-md border-white flex justify-center items-center transition-colors shadow-lg hover:bg-white/10">
            <PlusIcon className="text-white text-xl lg:text-2xl" />
          </div>
          <p className="text-white text-sm lg:text-base font-medium">
            Add Video
          </p>
        </div>
      </div>

      <div className="flex flex-col h-full w-full md:ml-[15%] lg:ml-[12%]">
        <VideosComponent videos={videos} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="w-full h-20 sm:h-24 bg-black border-t border-gray-800 flex justify-center items-center fixed bottom-0 md:hidden z-50">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-red-500 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600 active:bg-red-700 transition-colors shadow-lg"
          title="Add Video"
        >
          <PlusIcon className="text-white text-2xl sm:text-3xl" />
        </button>
      </div>
    </div>
  );
}
