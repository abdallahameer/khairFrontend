"use client";

import { useRef, useState, useEffect } from "react";
import { LuPlus as PlusIcon } from "react-icons/lu";
import VideosComponent from "./components/videos";
import { Video } from "./helpers/videoDB";
import { usePost, useGet } from "./hooks/useRequest";

const defaultVideos: Video[] = [{ id: 1, video: "/Quran/quranvideo1.mp4" }];

export default function Home() {
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { post } = usePost();
  const { get } = useGet();

  useEffect(() => {
    get("/api/videos/approved", {
      onSuccess: (data: any[]) => {
        const approved: Video[] = data.map((v) => ({
          id: v.id,
          video: v.video_url,
        }));
        setVideos([...defaultVideos, ...approved]);
      },
      onError: (error) => {
        console.error("Failed to fetch approved videos:", error);
      },
    });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64 URL for now
      // Note: For production you'll want to upload to Cloudinary or R2
      const reader = new FileReader();
      reader.onload = async () => {
        const video_url = reader.result as string;

        try {
          await post(
            "/api/videos/upload",
            { video_url },
            {
              onSuccess: () => {
                alert("Video uploaded! It is now pending reviewer approval.");
              },
              onError: (error) => {
                alert("Failed to upload video: " + error.message);
              },
            },
          );
        } catch (err: any) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      alert("Failed to process video: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex w-[15%] h-full bg-black border-r border-gray-800 flex-col p-2 items-start py-6 gap-6 fixed left-0 top-0 z-50">
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="w-full flex gap-2 items-center cursor-pointer"
        >
          <div className="bg-transparent w-6 h-6 border rounded-md border-white flex justify-center items-center transition-colors shadow-lg">
            <PlusIcon className="text-white text-2xl" />
          </div>
          <p className="text-white">
            {uploading ? "Uploading..." : "Add Video"}
          </p>
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
          onClick={() => !uploading && fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-red-500 w-12 h-12 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          <PlusIcon className="text-white text-2xl" />
        </button>
      </div>
    </div>
  );
}
