"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Star, Plus, Check, ThumbsUp, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface MovieCardProps {
  movie: Movie;
  onOpenModal: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  isLarge?: boolean;
}

export default function MovieCard({
  movie,
  onOpenModal,
  onPlayMovie,
  isLarge = false,
}: MovieCardProps) {
  const { isInWatchlist, toggleWatchlist, isLiked, toggleLike } = useWatchlist();

  const [isHovered, setIsHovered] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const inList = isInWatchlist(movie.id);
  const liked = isLiked(movie.id);
  const matchPercentage = Math.min(99, Math.floor(movie.vote_average * 10 + 10));
  const releaseYear = (movie.release_date || movie.first_air_date || "").split("-")[0] || "2024";

  // Debounced auto-play saat kursor diarahkan ke kartu (~400ms delay seperti Netflix)
  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 420);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setIsHovered(false);
    setIsVideoMuted(true);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex-shrink-0 transition-all duration-300 ease-out cursor-pointer ${
        isHovered ? "z-40 scale-110 sm:scale-115 shadow-2xl" : "z-10 hover:z-20 hover:scale-102"
      }`}
    >
      <div
        className={`relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 ${
          isLarge
            ? "w-[160px] sm:w-[200px] md:w-[230px] h-[240px] sm:h-[300px] md:h-[345px]"
            : "w-[220px] sm:w-[260px] md:w-[290px] h-[130px] sm:h-[155px] md:h-[170px]"
        }`}
      >
        {/* Poster Gambar Utama */}
        <Image
          src={getImageUrl(isLarge ? movie.poster_path : movie.backdrop_path, "w500")}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className={`object-cover transition-opacity duration-300 ${
            isHovered && movie.videoUrl ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Video Trailer Auto-play Saat di-Hover */}
        {isHovered && movie.videoUrl && (
          <div className="absolute inset-0 w-full h-full bg-black">
            <video
              ref={videoRef}
              src={movie.videoUrl}
              autoPlay
              muted={isVideoMuted}
              loop
              playsInline
              className="w-full h-full object-cover animate-in fade-in duration-300"
            />
            {/* Tombol Pengatur Suara Mini di Pojok Video */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVideoMuted(!isVideoMuted);
              }}
              className="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white transition backdrop-blur-sm cursor-pointer"
              title={isVideoMuted ? "Aktifkan Suara" : "Matikan Suara"}
            >
              {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Badge Tipe di Pojok Atas Kiri */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="bg-black/80 backdrop-blur-sm text-[9px] font-bold px-1.5 py-0.5 rounded text-gray-300 uppercase">
            {movie.media_type === "tv" ? "Serial" : "Film"}
          </span>
        </div>

        {/* Overlay Informasi & Kontrol Saat Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Baris Tombol Aksi Cepat */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              {/* Tombol Putar Penuh */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayMovie(movie);
                }}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/85 transition shadow cursor-pointer active:scale-90"
                title="Tonton Sekarang"
              >
                <Play className="w-4 h-4 fill-black text-black ml-0.5" />
              </button>

              {/* Tombol Watchlist */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(movie);
                }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer active:scale-90 ${
                  inList
                    ? "bg-[#E50914] border-[#E50914] text-white"
                    : "bg-zinc-800/80 border-gray-400 hover:border-white text-white"
                }`}
                title={inList ? "Hapus dari Daftar Saya" : "Tambah ke Daftar Saya"}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>

              {/* Tombol Suka */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(movie.id);
                }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer active:scale-90 ${
                  liked
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-zinc-800/80 border-gray-400 hover:border-white text-white"
                }`}
                title="Sukai Film Ini"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tombol Buka Modal Detail */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(movie);
              }}
              className="w-8 h-8 rounded-full border border-gray-400 bg-zinc-800/80 hover:border-white flex items-center justify-center text-white transition cursor-pointer"
              title="Informasi Rinci"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Judul & Metadata */}
          <h4 className="text-white text-xs sm:text-sm font-bold truncate drop-shadow">
            {movie.title}
          </h4>

          <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-gray-300 mt-1">
            <span className="text-green-400 font-bold">{matchPercentage}% Cocok</span>
            <span className="border border-gray-600 px-1 rounded text-[9px]">
              {movie.maturity_rating || "13+"}
            </span>
            <span>{releaseYear}</span>
            <div className="flex items-center space-x-0.5 text-yellow-400 ml-auto">
              <Star className="w-3 h-3 fill-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
