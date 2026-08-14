"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineMuted as UnmuteIcon } from "react-icons/ai";
import { ImVolumeMute2 as MutedIcon } from "react-icons/im";
import {
  LuTrash2 as DeleteIcon,
  LuShieldCheck as DenyIcon,
} from "react-icons/lu";
import { useDelete } from "../hooks/useRequest";
import useSWR from "swr";
import { Reports } from "../helpers/videoDB";
import { fetcher } from "../helpers/api";

export default function VideoReviewPage() {
  const { delete: deleteRequest } = useDelete();
  const [muted, setMuted] = useState(false);
  const [actingOnId, setActingOnId] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const router = useRouter();
  const {
    data: reports,
    mutate,
    isLoading,
  } = useSWR<Reports[]>("/api/reports", fetcher);

  useEffect(() => {
    const reviewer = localStorage.getItem("reviewer");
    if (!reviewer) {
      router.push("/reviewer-login");
    }
  }, [router]);

  const handleDeleteVideo = async (videoId: string) => {
    if (actingOnId) return;
    setActingOnId(videoId);
    try {
      await deleteRequest(`/api/reports/video/${videoId}`);
      mutate();
    } catch (error) {
      console.error("Failed to delete video:", error);
    } finally {
      setActingOnId(null);
    }
  };

  const handleDenyReport = async (reportId: string) => {
    if (actingOnId) return;
    setActingOnId(reportId);
    try {
      await deleteRequest(`/api/reports/${reportId}`);
      mutate();
    } catch (error) {
      console.error("Failed to deny report:", error);
    } finally {
      setActingOnId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("reviewer");
    router.push("/reviewer-login");
  };

  const handleClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-lg text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Video Review</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Logout
          </button>
        </div>

        {reports?.length === 0 ? (
          <div className="rounded-lg bg-gray-900 p-12 text-center">
            <p className="text-lg text-gray-400">No reported videos</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reports?.map((item, index) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-lg bg-gray-900"
              >
                <div className="flex flex-col gap-6 p-6 lg:flex-row">
                  <div className="flex-1">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        loop
                        playsInline
                        muted={muted}
                        onClick={() => handleClick(index)}
                        className="h-full w-full cursor-pointer object-contain"
                        src={item.video_url}
                      />
                      {!muted ? (
                        <UnmuteIcon
                          onClick={() => setMuted(true)}
                          className="absolute top-3 right-3 cursor-pointer text-2xl text-white opacity-70 hover:opacity-100"
                        />
                      ) : (
                        <MutedIcon
                          onClick={() => setMuted(false)}
                          className="absolute top-3 right-3 cursor-pointer text-2xl text-white opacity-70 hover:opacity-100"
                        />
                      )}
                    </div>

                    {item.description && (
                      <p className="mt-3 text-sm text-gray-300">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between lg:w-80">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Video
                        </h3>
                        <div className="space-y-1.5 text-sm text-gray-300">
                          <p>
                            <span className="text-gray-400">Owner:</span> @
                            {item.video_owner_username}
                          </p>
                          <p>
                            <span className="text-gray-400">Category:</span>{" "}
                            {item.category ?? "—"}
                          </p>
                          <p>
                            <span className="text-gray-400">Uploaded:</span>{" "}
                            {new Date(item.video_uploaded_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-4">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          Report
                        </h3>
                        <div className="space-y-1.5 text-sm text-gray-300">
                          <p>
                            <span className="text-gray-400">Reported by:</span>{" "}
                            @{item.reporter_username}
                          </p>
                          <p>
                            <span className="text-gray-400">Reported on:</span>{" "}
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                          <p className="text-gray-400">Reason:</p>
                          <p className="rounded-lg bg-black/40 p-3 text-gray-200">
                            {item.reason}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleDenyReport(item.id)}
                        disabled={actingOnId !== null}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-3 font-medium text-white transition duration-200 hover:bg-gray-600 disabled:opacity-50"
                      >
                        <DenyIcon className="text-xl" /> Deny Report
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(item.video_id)}
                        disabled={actingOnId !== null}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition duration-200 hover:bg-red-700 disabled:opacity-50"
                      >
                        <DeleteIcon className="text-xl" /> Delete Video
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
