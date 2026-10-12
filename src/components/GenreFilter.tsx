"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface GenreFilterProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  sortBy: string;
  onSelectSortBy: (sort: string) => void;
}

const GENRES = [
  "Semua",
  "Action",
  "Sci-Fi",
  "Drama",
  "Misteri",
  "Komedi",
  "Crime",
  "Petualangan",
  "Anime",
];

export default function GenreFilter({
  selectedGenre,
  onSelectGenre,
  sortBy,
  onSelectSortBy,
}: GenreFilterProps) {
  return (
    <div className="px-4 md:px-12 py-3 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm border-b border-zinc-800/80 bg-[#141414]">
      {/* Genre Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {GENRES.map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer font-medium ${
                isActive
                  ? "bg-white text-black font-bold shadow"
                  : "bg-zinc-800/90 text-gray-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Dropdown Pengurutan (Sorting) */}
      <div className="flex items-center space-x-2 text-gray-300 ml-auto">
        <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400 hidden sm:inline">Urutkan:</span>
        <select
          value={sortBy}
          onChange={(e) => onSelectSortBy(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-2.5 py-1 text-white text-xs focus:outline-none focus:border-red-500 cursor-pointer"
        >
          <option value="popularity">Populer</option>
          <option value="rating">Rating Tertinggi</option>
          <option value="latest">Rilis Terbaru</option>
        </select>
      </div>
    </div>
  );
}
