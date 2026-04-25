"use client";

import { useRef, useState } from "react";
import { LuPlus as PlusIcon } from "react-icons/lu";
import VideosComponent, { Video } from "./components/videos";

const defaultVideos: Video[] = [{ id: 1, video: "/Quran/quranvideo1.mp4" }];

export default function Home() {
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }

    const url = URL.createObjectURL(file);
    setVideos((prev) => [...prev, { id: Date.now(), video: url }]);

    e.target.value = "";
  };

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex w-[15%] h-full bg-black border-r border-gray-800 flex-col p-2 items-start py-6 gap-6 fixed left-0 top-0 z-50">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex gap-2 items-center cursor-pointer"
        >
          <div className="bg-transparent w-6 h-6 border rounded-md border-white flex justify-center items-center transition-colors shadow-lg">
            <PlusIcon className="text-white text-2xl" />
          </div>
          <p>Add Video</p>
        </div>
      </div>

      <div className="flex flex-col h-full w-full md:ml-20">
        <VideosComponent videos={videos} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="w-full h-20 bg-black flex justify-center items-center fixed bottom-0 md:hidden z-50">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-red-500 w-12 h-12 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600 transition-colors"
        >
          <PlusIcon className="text-white text-2xl" />
        </button>
      </div>
    </div>
  );
}
