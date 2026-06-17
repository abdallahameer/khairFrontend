"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LuPlus as PlusIcon } from "react-icons/lu";
import { LuCircleUser as UserIcon } from "react-icons/lu";
import { usePost } from "../hooks/useRequest";
import { AiFillHome as HomeIcon } from "react-icons/ai";
import { MdOutlineExplore as ExploreIcon } from "react-icons/md";
import { SlUserFollowing as FollowingIcon } from "react-icons/sl";
import {
  FaUserFriends as FriendsIcon,
  FaTelegramPlane as MessagesIcon,
} from "react-icons/fa";
import Image from "next/image";
import SearchInput from "./searchInput";

interface User {
  id: string;
  username: string;
  profile_image?: string | null;
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
  const router = useRouter();
  const pathName = usePathname();
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

      <div className="fixed top-0 left-0 z-50 hidden min-h-full w-[15%] flex-col items-start gap-6 border-r border-gray-800 bg-black p-2 py-6 md:flex">
        <SearchInput onSearch={() => {}} onClear={() => {}} />
        <div
          onClick={() => {
            if (pathName !== "/") {
              router.push("/");
            } else {
              window.location.reload();
            }
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800"
        >
          <HomeIcon className="text-2xl text-white" />
          <p>Home</p>
        </div>

        <div className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800">
          <ExploreIcon className="text-2xl text-white" />
          <p>Explore</p>
        </div>
        <div className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800">
          <FollowingIcon className="text-2xl text-white" />
          <p>Following</p>
        </div>
        <div className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800">
          <FriendsIcon className="text-2xl text-white" />
          <p>Friends</p>
        </div>
        <div className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800">
          <MessagesIcon className="text-2xl text-white" />
          <p>Messages</p>
        </div>
        {currentUser && (
          <div
            onClick={handleAddClick}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white bg-transparent shadow-lg transition-colors">
              <PlusIcon className="text-2xl text-white" />
            </div>
            <p className="text-white">
              {uploading ? "Uploading..." : "Add Video"}
            </p>
          </div>
        )}

        {currentUser ? (
          <div className="flex w-full flex-col gap-2">
            <div
              onClick={() => router.push(`/profile/${currentUser.id}`)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-700">
                {currentUser?.profile_image ? (
                  <Image
                    src={currentUser.profile_image}
                    alt={currentUser.username}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {currentUser.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <p className="truncate text-sm font-medium text-white">
                @{currentUser.username}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-2 text-left text-xs text-gray-400 transition-colors hover:text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <div
              onClick={onOpenRegister}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white bg-transparent shadow-lg transition-colors">
                <UserIcon className="text-2xl text-white" />
              </div>
              <p className="text-white">Register</p>
            </div>
            <div
              onClick={onOpenLogin}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-800"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white bg-transparent shadow-lg transition-colors">
                <UserIcon className="text-2xl text-white" />
              </div>
              <p className="text-white">Login</p>
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-gray-800 bg-black md:hidden">
        {currentUser ? (
          <>
            <button
              onClick={() => router.push(`/profile/${currentUser.id}`)}
              className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-gray-300"
            >
              <div className="flex h-8 w-full items-center justify-center rounded-full bg-gray-700">
                {currentUser?.profile_image ? (
                  <Image
                    src={currentUser.profile_image}
                    alt={currentUser.username}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {currentUser.username[0].toUpperCase()}
                  </span>
                )}
              </div>
            </button>
            <button className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-gray-300">
              <MessagesIcon className="text-2xl text-white" />
            </button>

            <button
              onClick={handleAddClick}
              disabled={uploading}
              className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-gray-300 disabled:opacity-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                <PlusIcon className="text-2xl text-white" />
              </div>
            </button>
            <button className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-gray-300">
              <ExploreIcon className="text-2xl text-white" />
            </button>
            <button
              onClick={() => {
                if (pathName !== "/") {
                  router.push("/");
                } else {
                  window.location.reload();
                }
              }}
              className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-gray-300"
            >
              <HomeIcon className="text-2xl text-white" />
            </button>
          </>
        ) : (
          <>
            <button className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-gray-300">
              <ExploreIcon className="text-2xl text-white" />
            </button>
            <button
              onClick={onOpenRegister}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-pink-600 transition-colors hover:bg-pink-700"
            >
              <UserIcon className="text-2xl text-white" />
            </button>
            <button
              onClick={() => {
                if (pathName !== "/") {
                  router.push("/");
                } else {
                  window.location.reload();
                }
              }}
              className="flex cursor-pointer flex-col items-center gap-1 transition-colors hover:text-gray-300"
            >
              <HomeIcon className="text-2xl text-white" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
