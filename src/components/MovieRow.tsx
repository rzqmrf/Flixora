"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onOpenModal: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  isLarge?: boolean;
}

export default function MovieRow({
  title,
  movies,
  onOpenModal,
  onPlayMovie,
  isLarge = false,
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-2 md:space-y-3 px-4 md:px-12 my-6 md:my-8 relative group">
      {/* Judul Kategori */}
      <h2 className="text-lg md:text-xl font-bold text-white tracking-wide hover:text-gray-300 transition cursor-pointer">
        {title}
      </h2>

      {/* Kontainer Baris Film dengan Tombol Navigasi Slider */}
      <div className="relative">
        {/* Tombol Geser Kiri */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-0 bottom-0 z-30 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-r"
          title="Geser ke kiri"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* List Kartu Film yang Dapat Digeser */}
        <div
          ref={rowRef}
          className="flex items-center space-x-3 md:space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-4 px-1"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onOpenModal={onOpenModal}
              onPlayMovie={onPlayMovie}
              isLarge={isLarge}
            />
          ))}
        </div>

        {/* Tombol Geser Kanan */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-0 bottom-0 z-30 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-l"
          title="Geser ke kanan"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
}
