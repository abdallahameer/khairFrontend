"use client";

import { useEffect, useState, useRef } from "react";
import { AiOutlineMuted as UnmuteIcon } from "react-icons/ai";
import { ImVolumeMute2 as MutedIcon } from "react-icons/im";
import { LuCheck as ApproveIcon, LuX as RejectIcon } from "react-icons/lu";
import {
  getPendingVideos,
  deletePendingVideo,
  addApprovedVideo,
  PendingVideo,
} from "../helpers/videoDB";

interface PendingVideoWithUrl extends PendingVideo {
  objectUrl: string;
}

export default function VideoReviewPage() {
  const [pendingVideos, setPendingVideos] = useState<PendingVideoWithUrl[]>([]);
  const [muted, setMuted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const load = async () => {
      const videos = await getPendingVideos();
      const withUrls: PendingVideoWithUrl[] = videos.map((v) => ({
        ...v,
        objectUrl: URL.createObjectURL(v.file),
      }));
      setPendingVideos(withUrls);
    };
    load();

    return () => {
      pendingVideos.forEach((v) => URL.revokeObjectURL(v.objectUrl));
    };
  }, []);

  const handleApprove = async (id: number | string) => {
    const video = pendingVideos.find((v) => v.id === id);
    if (!video) return;

    await addApprovedVideo({ id: video.id, file: video.file });
    await deletePendingVideo(id);

    URL.revokeObjectURL(video.objectUrl);
    setPendingVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleReject = async (id: number | string) => {
    const video = pendingVideos.find((v) => v.id === id);
    if (!video) return;

    await deletePendingVideo(id);

    URL.revokeObjectURL(video.objectUrl);
    setPendingVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-3 sm:p-4 lg:p-6 py-6 sm:py-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
          Video Review
        </h1>

        {pendingVideos.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 sm:p-12 text-center">
            <p className="text-gray-400 text-base sm:text-lg">
              No pending videos to review
            </p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-8">
            {pendingVideos.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                  <div className="flex-1 min-w-0">
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
                        src={item.objectUrl}
                      />
                      {!muted ? (
                        <UnmuteIcon
                          onClick={() => setMuted(true)}
                          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-white text-xl sm:text-2xl opacity-70 hover:opacity-100 cursor-pointer transition-opacity p-1 hover:bg-black/30 rounded"
                        />
                      ) : (
                        <MutedIcon
                          onClick={() => setMuted(false)}
                          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-white text-xl sm:text-2xl opacity-70 hover:opacity-100 cursor-pointer transition-opacity p-1 hover:bg-black/30 rounded"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between lg:w-80">
                    <div>
                      <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                        Video Details
                      </h3>
                      <div className="space-y-2 text-gray-300 text-xs sm:text-sm">
                        <p>
                          <span className="text-gray-400">Uploaded:</span>{" "}
                          <br className="sm:hidden" />
                          <span className="sm:inline"> </span>
                          {new Date(item.uploadedAt).toLocaleString()}
                        </p>
                        <p>
                          <span className="text-gray-400">Status:</span>
                          <span className="inline-block ml-2 bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded text-xs">
                            Pending Review
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <ApproveIcon className="text-lg sm:text-xl" />
                        <span className="hidden sm:inline">Approve</span>
                        <span className="sm:hidden">Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <RejectIcon className="text-lg sm:text-xl" />
                        <span className="hidden sm:inline">Reject</span>
                        <span className="sm:hidden">Reject</span>
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
