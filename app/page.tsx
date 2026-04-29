"use client";

import { useRef, useState, useEffect } from "react";
import { LuPlus as PlusIcon } from "react-icons/lu";
import VideosComponent from "./components/videos";
import { Video } from "./helpers/videoDB";
import { supabase } from "./Supabaseclient";

const defaultVideos: Video[] = [{ id: 1, video: "/Quran/quranvideo1.mp4" }];

export default function Home() {
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadApprovedVideos = async () => {
    const { data, error } = await supabase
      .from("approved_videos")
      .select("*")
      .order("approved_at", { ascending: true });

    if (error) {
      console.error("Error loading approved videos:", error.message);
      return;
    }

    const approvedVideos: Video[] = data.map((v) => ({
      id: v.id,
      video: v.video_url,
    }));

    setVideos([...defaultVideos, ...approvedVideos]);
  };

  useEffect(() => {
    loadApprovedVideos();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }

    setUploading(true);

    try {
      const fileName = `pending/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("pending_videos").insert({
        id: Date.now(),
        video_url: urlData.publicUrl,
      });

      if (dbError) throw dbError;

      alert("Video uploaded! It is now pending reviewer approval.");
    } catch (err: any) {
      console.error(err);
      alert("Failed to upload video: " + err.message);
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
