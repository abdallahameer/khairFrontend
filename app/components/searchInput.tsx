"use client";

import { useState } from "react";
import { IoSearch as SearchIcon } from "react-icons/io5";
import { MdClear as ClearIcon } from "react-icons/md";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  className?: string;
}

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
  onClear,
  className = "",
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onClear?.();
    onSearch("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3 text-gray-400 text-lg" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <ClearIcon className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
}
