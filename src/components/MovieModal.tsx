"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  Play,
  Plus,
  Check,
  ThumbsUp,
  Star,
  Users,
  Clapperboard,
  Download,
  ListVideo,
  MessageSquare,
  Send,
} from "lucide-react";
import { Movie, Episode, Review } from "@/types/movie";
import { getImageUrl, ALL_CATALOG } from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie, episodeId?: number) => void;
}

export default function MovieModal({
  movie,
  onClose,
  onSelectMovie,
  onPlayMovie,
}: MovieModalProps) {
  const { isInWatchlist, toggleWatchlist, isLiked, toggleLike } = useWatchlist();
  const [activeTab, setActiveTab] = useState<"details" | "episodes" | "similar" | "reviews">("details");
  const [videoMode, setVideoMode] = useState<"stream" | "youtube">("stream");
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  // Download simulation state
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  // User reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (movie) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setVideoMode("stream");
      setActiveTab("details");
      setSelectedSeasonIndex(0);

      // Muat review dari localStorage atau default
      try {
        const saved = localStorage.getItem(`flixora_reviews_${movie.id}`);
        if (saved) {
          setReviews(JSON.parse(saved));
        } else {
          setReviews(movie.reviews || []);
        }
      } catch {
        setReviews(movie.reviews || []);
      }
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const liked = isLiked(movie.id);
  const matchPercentage = Math.min(99, Math.floor(movie.vote_average * 10 + 10));
  const releaseYear = (movie.release_date || movie.first_air_date || "").split("-")[0] || "2024";

  // Simulasi download
  const handleDownload = () => {
    if (downloadProgress !== null) return;
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Kirim ulasan baru
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      movieId: movie.id,
      userName: "Anda (Penonton)",
      rating: newRating,
      date: "Baru saja",
      comment: newComment.trim(),
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    setNewComment("");
    try {
      localStorage.setItem(`flixora_reviews_${movie.id}`, JSON.stringify(updated));
    } catch {}
  };

  const similarMovies = ALL_CATALOG.filter(
    (m) =>
      m.id !== movie.id &&
      m.genres?.some((g) => movie.genres?.some((mg) => mg.name === g.name))
  ).slice(0, 4);

  const seasons = movie.seasons || [];
  const currentSeason = seasons[selectedSeasonIndex] || seasons[0];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#181818] text-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/80 animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[94vh] flex flex-col"
      >
        {/* Tombol Tutup (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/75 hover:bg-zinc-800 transition flex items-center justify-center text-white border border-gray-600 cursor-pointer"
          title="Tutup (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Preview Section */}
        <div className="relative aspect-video w-full bg-black shrink-0">
          {videoMode === "stream" && movie.videoUrl ? (
            <video
              ref={videoRef}
              src={movie.videoUrl}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          ) : movie.trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={getImageUrl(movie.backdrop_path, "original")}
                alt={movie.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />
            </div>
          )}

          {/* Toggle Stream vs YouTube Trailer */}
          {movie.trailerKey && movie.videoUrl && (
            <div className="absolute bottom-3 right-3 z-20 flex items-center space-x-2">
              <button
                onClick={() => setVideoMode(videoMode === "stream" ? "youtube" : "stream")}
                className="bg-black/80 hover:bg-black text-xs font-semibold px-2.5 py-1 rounded-md border border-gray-600 text-gray-200 flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Clapperboard className="w-3.5 h-3.5 text-red-500" />
                <span>{videoMode === "stream" ? "Buka Trailer YouTube" : "Buka Pemutar Stream"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Konten Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Header & Aksi Cepat */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[#E50914] font-black text-xs uppercase tracking-wider">
                  FLIXORA EXCLUSIVE
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-xs font-semibold uppercase">
                  {movie.media_type === "tv" ? "Serial TV" : "Film Layar Lebar"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{movie.title}</h2>
              <div className="flex flex-wrap items-center space-x-3 text-sm text-gray-300 mt-2">
                <span className="text-green-400 font-bold">{matchPercentage}% Cocok</span>
                <span>{releaseYear}</span>
                <span className="border border-gray-500 px-1.5 py-0.5 rounded text-xs font-semibold">
                  {movie.maturity_rating || "16+"}
                </span>
                <span className="text-gray-400 font-medium">
                  {movie.duration || (movie.media_type === "tv" ? "1 Musim" : "2j 10m")}
                </span>
                <span className="border border-zinc-700 px-1.5 rounded text-[10px] font-bold text-amber-400">
                  4K ULTRA HD
                </span>
                <div className="flex items-center space-x-1 text-yellow-400 font-semibold pl-1">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)} / 10</span>
                </div>
              </div>
            </div>

            {/* Tombol Interaksi */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  onClose();
                  onPlayMovie(movie);
                }}
                className="flex items-center space-x-2 bg-white text-black hover:bg-white/85 transition px-5 py-2.5 rounded-lg font-bold text-sm cursor-pointer active:scale-95 shadow-md"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Mulai Menonton</span>
              </button>

              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition border cursor-pointer ${
                  inList
                    ? "bg-[#E50914] border-[#E50914] text-white"
                    : "bg-zinc-800 border-zinc-600 hover:border-white text-white"
                }`}
                title="Daftar Saya"
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>

              <button
                onClick={() => toggleLike(movie.id)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition cursor-pointer ${
                  liked
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "border-gray-500 bg-zinc-800 hover:border-white text-white"
                }`}
                title="Sukai Film"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>

              {/* Tombol Unduh Offline Simulation */}
              <button
                onClick={handleDownload}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition cursor-pointer ${
                  downloadProgress === 100
                    ? "bg-green-600/30 border-green-500 text-green-300"
                    : downloadProgress !== null
                    ? "bg-zinc-800 border-amber-500 text-amber-300"
                    : "bg-zinc-800 border-zinc-600 text-gray-300 hover:text-white"
                }`}
                title="Unduh untuk Menonton Offline"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {downloadProgress === 100
                    ? "Tersimpan"
                    : downloadProgress !== null
                    ? `${downloadProgress}%`
                    : "Unduh"}
                </span>
              </button>
            </div>
          </div>

          {/* Tab Navigasi Modal */}
          <div className="flex border-b border-zinc-800 text-sm font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2.5 px-1 mr-6 border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === "details"
                  ? "border-[#E50914] text-white font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              Ringkasan & Detail
            </button>

            {seasons.length > 0 && (
              <button
                onClick={() => setActiveTab("episodes")}
                className={`pb-2.5 px-1 mr-6 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === "episodes"
                    ? "border-[#E50914] text-white font-bold"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                <ListVideo className="w-4 h-4" />
                <span>Episode & Musim</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2.5 px-1 mr-6 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === "reviews"
                  ? "border-[#E50914] text-white font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ulasan Penonton ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("similar")}
              className={`pb-2.5 px-1 border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === "similar"
                  ? "border-[#E50914] text-white font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              Rekomendasi Serupa ({similarMovies.length})
            </button>
          </div>

          {/* Konten Tab 1: Ringkasan & Detail */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Sinopsis Cerita
                </h4>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                  {movie.overview}
                </p>

                {movie.cast && movie.cast.length > 0 && (
                  <div className="pt-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      <Users className="w-3.5 h-3.5" />
                      <span>Daftar Pemeran Utama</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {movie.cast.map((actor) => (
                        <span
                          key={actor}
                          className="bg-zinc-800 text-gray-200 text-xs px-2.5 py-1 rounded-md border border-zinc-700/60"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm border-t md:border-t-0 md:border-l border-zinc-800 md:pl-6 pt-4 md:pt-0">
                <div>
                  <span className="text-gray-400 block text-xs mb-1">Genre:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.genres?.map((g) => (
                      <span
                        key={g.id}
                        className="bg-red-950/40 text-red-300 border border-red-900/50 text-xs px-2 py-0.5 rounded"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-gray-400 block text-xs">Kualitas Tayangan:</span>
                  <span className="text-gray-200 font-medium">4K Ultra HD, Dolby Vision, Dolby Atmos</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Audio Track:</span>
                  <span className="text-gray-200">Bahasa Indonesia (Dolby 5.1), English Original, Japanese</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-xs">Subtitle Tersedia:</span>
                  <span className="text-gray-200">Bahasa Indonesia, English, Off</span>
                </div>
              </div>
            </div>
          )}

          {/* Konten Tab 2: Episode & Musim (TV Series) */}
          {activeTab === "episodes" && seasons.length > 0 && (
            <div className="space-y-5">
              {/* Season Selector */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">Daftar Episode</h3>
                {seasons.length > 1 && (
                  <select
                    value={selectedSeasonIndex}
                    onChange={(e) => setSelectedSeasonIndex(parseInt(e.target.value))}
                    className="bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                  >
                    {seasons.map((s, idx) => (
                      <option key={s.season_number} value={idx}>
                        {s.title} ({s.episodes.length} Episode)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Daftar Episode Card */}
              <div className="space-y-3">
                {currentSeason.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => {
                      onClose();
                      onPlayMovie(movie, ep.id);
                    }}
                    className="group bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                      <span className="font-extrabold text-base text-gray-400 group-hover:text-white w-6">
                        {ep.episode_number}
                      </span>
                      <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                        <Image
                          src={getImageUrl(ep.still_path, "w500")}
                          alt={ep.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition">
                          <Play className="w-5 h-5 fill-white text-white drop-shadow" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-white group-hover:text-red-400 transition">
                            {ep.title}
                          </h4>
                          <span className="text-[11px] text-gray-400 font-mono">({ep.duration})</span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed max-w-lg">
                          {ep.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Konten Tab 3: Ulasan Penonton */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Form Tulis Ulasan */}
              <form onSubmit={handleAddReview} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Tulis Ulasan Anda untuk {movie.title}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Beri Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setNewRating(star)}
                      className={`w-5 h-5 cursor-pointer transition ${
                        star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-yellow-400 ml-1">({newRating}/5 Bintang)</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Bagikan pendapat Anda tentang cerita atau akting film ini..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="bg-[#E50914] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>

              {/* List Ulasan */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{rev.userName}</span>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400" />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Konten Tab 4: Rekomendasi Serupa */}
          {activeTab === "similar" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              {similarMovies.map((simMovie) => (
                <div
                  key={simMovie.id}
                  onClick={() => onSelectMovie(simMovie)}
                  className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:scale-103 transition-transform duration-200"
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={getImageUrl(simMovie.backdrop_path, "w500")}
                      alt={simMovie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-xs truncate text-white group-hover:text-red-400 transition">
                      {simMovie.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                      {simMovie.overview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
