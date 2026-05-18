"use client";

import { BiSolidGhost } from "react-icons/bi";

export default function NoContent() {
  return (
    <div className="h-dvh flex justify-center items-center bg-black">
      <div className="flex flex-col justify-center items-center gap-4">
        <BiSolidGhost className="text-gray-400 text-6xl sm:text-7xl opacity-70" />
        <p className="text-white text-xl sm:text-2xl font-light tracking-wide opacity-70">
          No videos available
        </p>
      </div>
    </div>
  );
}
