"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchHistory } from "@/context/WatchHistoryContext";
import { useAuth } from "@/context/AuthContext";

interface ContinueWatchingRowProps {
  movies: Movie[];
  onPlayResume: (movie: Movie, startTime: number, episodeId?: number) => void;
  onOpenModal: (movie: Movie) => void;
}

export default function ContinueWatchingRow({
  movies,
  onPlayResume,
  onOpenModal,
}: ContinueWatchingRowProps) {
  const { history, removeFromHistory } = useWatchHistory();
  const { currentProfile } = useAuth();
  const rowRef = useRef<HTMLDivElement>(null);

  // Filter history yang memiliki durasi valid dan belum selesai (5% - 95%)
  const continueItems = history
    .map((h) => {
      const movie = movies.find((m) => m.id === h.movieId);
      if (!movie) return null;
      const percent = Math.min(100, Math.floor((h.progressSeconds / (h.durationSeconds || 1)) * 100));
      return {
        movie,
        history: h,
        percent,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && item.percent >= 3 && item.percent <= 96);

  if (continueItems.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-3 px-4 md:px-12 my-6 md:my-8 relative group">
      <div className="flex items-center space-x-2">
        <RotateCcw className="w-5 h-5 text-[#E50914]" />
        <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
          Lanjutkan Menonton untuk {currentProfile?.name || "Anda"}
        </h2>
      </div>

      <div className="relative">
        {/* Tombol Geser Kiri */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-0 bottom-0 z-30 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-r"
          title="Geser ke kiri"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Kontainer Kartu Lanjutkan Menonton */}
        <div
          ref={rowRef}
          className="flex items-center space-x-3 md:space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-3"
        >
          {continueItems.map(({ movie, history: h, percent }) => {
            const remainingMins = Math.max(1, Math.floor((h.durationSeconds - h.progressSeconds) / 60));
            return (
              <div
                key={movie.id}
                className="group/card relative flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-103 duration-200"
              >
                {/* Gambar Thumbnail */}
                <div
                  onClick={() => onPlayResume(movie, h.progressSeconds, h.episodeId)}
                  className="relative aspect-video w-full cursor-pointer"
                >
                  <Image
                    src={getImageUrl(movie.backdrop_path, "w500")}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover/card:opacity-90 transition"
                  />
                  {/* Overlay Play Icon */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                    </div>
                  </div>

                  {/* Tombol Hapus dari History */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(movie.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-white transition z-20 cursor-pointer"
                    title="Hapus dari Lanjutkan Menonton"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress Bar Merah */}
                <div className="w-full bg-zinc-700 h-1.5 relative">
                  <div
                    className="bg-[#E50914] h-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Info Bawah */}
                <div className="p-3 flex items-center justify-between">
                  <div className="truncate">
                    <h4
                      onClick={() => onOpenModal(movie)}
                      className="text-white text-xs font-bold truncate hover:underline cursor-pointer"
                    >
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {h.episodeTitle ? `${h.episodeTitle} • ` : ""}Sisa {remainingMins} menit
                    </p>
                  </div>

                  <button
                    onClick={() => onPlayResume(movie, h.progressSeconds, h.episodeId)}
                    className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition ml-2 shrink-0 cursor-pointer"
                    title="Lanjutkan"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>
              </div>
            );
          })}
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
