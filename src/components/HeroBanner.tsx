"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Info, Plus, Check, Volume2, VolumeX } from "lucide-react";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface HeroBannerProps {
  movie: Movie;
  onOpenModal: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
}

export default function HeroBanner({
  movie,
  onOpenModal,
  onPlayMovie,
}: HeroBannerProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const inList = isInWatchlist(movie.id);

  // Putar video latar belakang setelah 1.5 detik
  useEffect(() => {
    setShowVideo(false);
    const timer = setTimeout(() => {
      if (movie.videoUrl) {
        setShowVideo(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="relative w-full h-[68vh] md:h-[82vh] lg:h-[88vh] text-white">
      {/* Background Image Banner */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={getImageUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${
            showVideo ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Video Latar Belakang Auto-play */}
        {showVideo && movie.videoUrl && (
          <video
            src={movie.videoUrl}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000"
          />
        )}

        {/* Flixora Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/65 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/25 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/80 to-transparent" />
      </div>

      {/* Konten Hero Teks & Aksi */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 md:px-12 pb-16 md:pb-24 max-w-3xl space-y-3 md:space-y-4">
        {/* Badge Tipe / Serial */}
        <div className="flex items-center space-x-2">
          <span className="text-[#E50914] font-black text-xs md:text-sm tracking-widest uppercase flex items-center">
            FLIXORA EXCLUSIVE
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
            {movie.duration ? movie.duration : movie.media_type === "tv" ? "Serial TV" : "Film Bioskop"}
          </span>
        </div>

        {/* Judul Film */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-xl leading-tight">
          {movie.title}
        </h1>

        {/* Ringkasan Sinopsis */}
        <p className="text-sm md:text-base text-gray-200 line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow leading-relaxed">
          {movie.overview}
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Tombol Putar Penuh */}
          <button
            onClick={() => onPlayMovie(movie)}
            className="flex items-center space-x-2 bg-white text-black hover:bg-white/85 transition px-6 md:px-8 py-2 md:py-2.5 rounded-lg font-bold text-sm md:text-base shadow-lg cursor-pointer active:scale-95"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>Putar Film</span>
          </button>

          {/* Tombol Watchlist */}
          <button
            onClick={() => toggleWatchlist(movie)}
            className={`flex items-center space-x-2 transition px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-sm md:text-base backdrop-blur-sm cursor-pointer active:scale-95 border ${
              inList
                ? "bg-[#E50914]/20 border-[#E50914] text-white"
                : "bg-gray-500/50 hover:bg-gray-500/40 border-gray-400/30 text-white"
            }`}
          >
            {inList ? (
              <>
                <Check className="w-5 h-5 text-red-400" />
                <span>Di Daftar Saya</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Daftar Saya</span>
              </>
            )}
          </button>

          {/* Tombol Info */}
          <button
            onClick={() => onOpenModal(movie)}
            className="flex items-center space-x-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-white transition px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-sm md:text-base backdrop-blur-sm cursor-pointer active:scale-95"
          >
            <Info className="w-5 h-5" />
            <span className="hidden sm:inline">Detail Lengkap</span>
          </button>
        </div>
      </div>

      {/* Kontrol Suara & Rating di Pojok Kanan Bawah */}
      <div className="absolute right-0 bottom-24 flex items-center space-x-3 pr-4 md:pr-12">
        {showVideo && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-full border border-gray-500 bg-black/60 hover:bg-black/90 flex items-center justify-center text-white transition cursor-pointer"
            title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
        <div className="hidden md:flex items-center bg-zinc-800/80 border-l-4 border-red-600 py-1.5 px-3 text-xs font-bold text-gray-200">
          <span>{movie.maturity_rating || "16+"}</span>
        </div>
      </div>
    </div>
  );
}
