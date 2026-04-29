"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineMuted as UnmuteIcon } from "react-icons/ai";
import { ImVolumeMute2 as MutedIcon } from "react-icons/im";
import { LuCheck as ApproveIcon, LuX as RejectIcon } from "react-icons/lu";
import { supabase } from "../Supabaseclient";

interface PendingVideo {
  id: number | string;
  video_url: string;
  uploaded_at: string;
}

export default function VideoReviewPage() {
  const [pendingVideos, setPendingVideos] = useState<PendingVideo[]>([]);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const reviewer = localStorage.getItem("reviewer");
    if (!reviewer) {
      router.push("/login");
      return;
    }
    loadPendingVideos();
  }, []);

  const loadPendingVideos = async () => {
    const { data, error } = await supabase
      .from("pending_videos")
      .select("*")
      .order("uploaded_at", { ascending: true });

    if (error) {
      console.error("Error loading pending videos:", error.message);
    } else {
      setPendingVideos(data);
    }
    setLoading(false);
  };

  const handleApprove = async (id: number | string) => {
    const video = pendingVideos.find((v) => v.id === id);
    if (!video) return;

    const { error: insertError } = await supabase
      .from("approved_videos")
      .insert({ id: video.id, video_url: video.video_url });

    if (insertError) {
      alert("Failed to approve: " + insertError.message);
      return;
    }

    const { error: deleteError } = await supabase
      .from("pending_videos")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("Failed to remove from pending: " + deleteError.message);
      return;
    }

    setPendingVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleReject = async (id: number | string) => {
    const video = pendingVideos.find((v) => v.id === id);
    if (!video) return;

    const urlParts = video.video_url.split("/videos/");
    const filePath = urlParts[1];

    if (filePath) {
      await supabase.storage.from("videos").remove([filePath]);
    }

    const { error } = await supabase
      .from("pending_videos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to reject: " + error.message);
      return;
    }

    setPendingVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("reviewer");
    router.push("/login");
  };

  const handleClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Video Review</h1>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Logout
          </button>
        </div>

        {pendingVideos.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No pending videos to review</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingVideos.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                  <div className="flex-1">
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        loop
                        playsInline
                        muted={muted}
                        onClick={() => handleClick(index)}
                        className="w-full h-full object-contain cursor-pointer"
                        src={item.video_url}
                      />
                      {!muted ? (
                        <UnmuteIcon
                          onClick={() => setMuted(true)}
                          className="absolute top-3 right-3 text-white text-2xl opacity-70 cursor-pointer hover:opacity-100"
                        />
                      ) : (
                        <MutedIcon
                          onClick={() => setMuted(false)}
                          className="absolute top-3 right-3 text-white text-2xl opacity-70 cursor-pointer hover:opacity-100"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between lg:w-64">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        Video Details
                      </h3>
                      <div className="space-y-2 text-gray-300 text-sm">
                        <p>
                          <span className="text-gray-400">Uploaded:</span>{" "}
                          {new Date(item.uploaded_at).toLocaleString()}
                        </p>
                        <p>
                          <span className="text-gray-400">Status:</span> Pending
                          Review
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <ApproveIcon className="text-xl" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <RejectIcon className="text-xl" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
