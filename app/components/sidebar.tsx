"use client";

import { useRef, useState } from "react";
import { LuPlus as PlusIcon } from "react-icons/lu";
import { LuCircleUser as UserIcon } from "react-icons/lu";
import { usePost } from "../hooks/useRequest";

interface User {
  id: string;
  username: string;
}

interface SidebarProps {
  currentUser: User | null;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  currentUser,
  onOpenRegister,
  onOpenLogin,
  onLogout,
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { post } = usePost();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) {
      alert("You need to register or login first");
      return;
    }

    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const invalidFile = files.find((file) => !file.type.startsWith("video/"));
    if (invalidFile) {
      alert("Please select only video files");
      return;
    }

    setUploading(true);

    try {
      const BATCH_SIZE = 5;

      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);

        await Promise.all(
          batch.map(async (file) => {
            const formData = new FormData();
            formData.append("video", file);
            formData.append("user_id", currentUser.id);
            return post("/api/videos/upload", formData);
          }),
        );
      }

      alert(`${files.length} video(s) uploaded successfully!`);
    } catch (err: any) {
      console.error(err);
      alert("Some uploads failed: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
    window.location.reload();
  };

  const handleAddClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="hidden md:flex w-[15%] min-h-full bg-black border-r border-gray-800 flex-col p-2 items-start py-6 gap-6  left-0 top-0 z-50">
        {currentUser && (
          <div
            onClick={handleAddClick}
            className="w-full flex gap-2 items-center cursor-pointer"
          >
            <div className="bg-transparent w-6 h-6 border rounded-md border-white flex justify-center items-center transition-colors shadow-lg">
              <PlusIcon className="text-white text-2xl" />
            </div>
            <p className="text-white">
              {uploading ? "Uploading..." : "Add Video"}
            </p>
          </div>
        )}

        {currentUser ? (
          <div className="w-full flex flex-col gap-2">
            <p className="text-white text-sm font-medium truncate">
              @{currentUser.username}
            </p>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-xs text-left transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <div
              onClick={onOpenRegister}
              className="w-full flex gap-2 items-center cursor-pointer"
            >
              <div className="bg-transparent w-6 h-6 border rounded-md border-white flex justify-center items-center transition-colors shadow-lg">
                <UserIcon className="text-white text-2xl" />
              </div>
              <p className="text-white">Register</p>
            </div>
            <div
              onClick={onOpenLogin}
              className="w-full flex gap-2 items-center cursor-pointer"
            >
              <div className="bg-transparent w-6 h-6 border rounded-md border-white flex justify-center items-center transition-colors shadow-lg">
                <UserIcon className="text-white text-2xl" />
              </div>
              <p className="text-white">Login</p>
            </div>
          </>
        )}
      </div>

      <div className="w-full h-20 bg-black flex justify-center items-center fixed bottom-0 md:hidden z-50">
        {currentUser ? (
          <button
            onClick={handleAddClick}
            disabled={uploading}
            className="bg-red-500 w-12 h-12 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <PlusIcon className="text-white text-2xl" />
          </button>
        ) : (
          <button
            onClick={onOpenRegister}
            className="bg-blue-600 w-12 h-12 rounded-full flex justify-center items-center cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <UserIcon className="text-white text-2xl" />
          </button>
        )}
      </div>
    </>
  );
}
