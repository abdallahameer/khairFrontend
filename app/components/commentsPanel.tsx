"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { apiClient, fetcher } from "../helpers/api";
import Image from "next/image";

interface Comment {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  username: string;
  profile_image: string | null;
}

export default function CommentsPanel({
  videoId,
  onClose,
}: {
  videoId: string;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const { data: comments, mutate } = useSWR<Comment[]>(
    `/api/videos/${videoId}/comments`,
    fetcher,
  );

  const handleSubmit = async () => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      alert("You need to login first");
      return;
    }
    const user = JSON.parse(stored);
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await apiClient.post(`/api/videos/${videoId}/comments`, {
        user_id: user.id,
        text: text.trim(),
      });
      setText("");
      mutate();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-black/50 transition-opacity duration-300 lg:hidden ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed right-0 bottom-0 left-0 z-[100] flex h-[70vh] flex-col rounded-t-2xl bg-gray-900 shadow-2xl transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "translate-y-full"} lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto lg:h-full lg:w-[350px] lg:rounded-none lg:transition-transform lg:duration-300 lg:ease-out ${visible ? "lg:translate-x-0" : "lg:translate-x-full"} `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h3 className="font-semibold text-white">
            Comments {comments ? `(${comments.length})` : ""}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {!comments || comments.length === 0 ? (
            <p className="mt-8 text-center text-gray-500">
              No comments yet — be the first!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {comment.profile_image ? (
                  <Image
                    src={comment.profile_image}
                    alt={comment.username}
                    width={40}
                    height={40}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-700">
                    <span className="text-xs font-bold text-white">
                      {comment.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    @{comment.username}
                  </p>
                  <p className="text-sm text-gray-300">{comment.text}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 border-t border-gray-700 p-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Add a comment..."
            className="flex-1 rounded-full bg-gray-800 px-4 py-2 text-white placeholder-gray-500 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
            className="rounded-full bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </>
  );
}
