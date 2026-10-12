"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  FastForward,
  MessageSquare,
  Settings,
  ListVideo,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";
import { Movie, Episode } from "@/types/movie";
import { useWatchHistory } from "@/context/WatchHistoryContext";

interface WatchPlayerProps {
  movie: Movie;
  initialEpisodeId?: number;
  initialTime?: number;
  onBack: () => void;
}

export default function WatchPlayer({
  movie,
  initialEpisodeId,
  initialTime = 0,
  onBack,
}: WatchPlayerProps) {
  const { updateProgress } = useWatchHistory();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Episode yang sedang diputar (jika serial TV)
  const allEpisodes: Episode[] = movie.seasons?.flatMap((s) => s.episodes) || [];
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(() => {
    if (initialEpisodeId) {
      return allEpisodes.find((ep) => ep.id === initialEpisodeId) || allEpisodes[0] || null;
    }
    return allEpisodes[0] || null;
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Kontrol Tingkat Lanjut
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedAudio, setSelectedAudio] = useState<string>("Bahasa Indonesia (Dolby 5.1)");
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>("Bahasa Indonesia");
  const [selectedQuality, setSelectedQuality] = useState<string>("Auto (4K)");

  // Menu Popups
  const [showAudioSubMenu, setShowAudioSubMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showEpisodesDrawer, setShowEpisodesDrawer] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Teks subtitle simulasi dinamis
  const getActiveSubtitleText = () => {
    if (selectedSubtitle === "Mati") return null;
    const mod = Math.floor(currentTime) % 15;
    if (mod >= 1 && mod <= 4) {
      return selectedSubtitle === "English"
        ? "[Dramatic orchestral theme intensifies]"
        : "[Musik tema orkestra dramatis memuncak]";
    } else if (mod >= 5 && mod <= 9) {
      return selectedSubtitle === "English"
        ? `"We have to get out of here before they find us!"`
        : `"Kita harus keluar dari sini sebelum mereka menemukan kita!"`;
    } else if (mod >= 10 && mod <= 13) {
      return selectedSubtitle === "English"
        ? `"Hold on! The signal is coming from the dark side of the portal."`
        : `"Bertahanlah! Sinyalnya berasal dari sisi gelap portal itu."`;
    }
    return null;
  };

  // Format waktu
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Reset hide timer
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showAudioSubMenu && !showSpeedMenu && !showEpisodesDrawer) {
        setShowControls(false);
      }
    }, 3500);
  }, [isPlaying, showAudioSubMenu, showSpeedMenu, showEpisodesDrawer]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimeout]);

  // Set initial time jika lanjut menonton
  useEffect(() => {
    if (initialTime > 0 && videoRef.current) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  // Update watch history secara periodik
  useEffect(() => {
    if (currentTime > 0 && duration > 0) {
      updateProgress(
        movie.id,
        currentTime,
        duration,
        currentEpisode?.id,
        currentEpisode?.title
      );
    }
  }, [currentTime, duration, movie.id, currentEpisode, updateProgress]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        resetControlsTimeout();
      }
    }
  };

  // Skip 10s
  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds)
      );
      resetControlsTimeout();
    }
  };

  // Lewati Intro (Skip Intro)
  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 28;
      resetControlsTimeout();
    }
  };

  // Ganti Episode
  const handleSelectEpisode = (ep: Episode) => {
    setCurrentEpisode(ep);
    setShowEpisodesDrawer(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Episode Berikutnya
  const nextEpisodeIndex = currentEpisode
    ? allEpisodes.findIndex((e) => e.id === currentEpisode.id) + 1
    : -1;
  const nextEpisode = nextEpisodeIndex > 0 && nextEpisodeIndex < allEpisodes.length ? allEpisodes[nextEpisodeIndex] : null;

  // Handle Kecepatan
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
    resetControlsTimeout();
  };

  // Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false;
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
      resetControlsTimeout();
    }
  };

  // Seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
    resetControlsTimeout();
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
    resetControlsTimeout();
  };

  const activeVideoUrl =
    currentEpisode?.videoUrl ||
    movie.videoUrl ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimeout}
      onClick={() => {
        resetControlsTimeout();
        setShowAudioSubMenu(false);
        setShowSpeedMenu(false);
      }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={activeVideoUrl}
        autoPlay
        playsInline
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsLoading(false);
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Floating Subtitle Dinamis di Layar */}
      {getActiveSubtitleText() && (
        <div className="absolute bottom-24 sm:bottom-28 left-0 right-0 flex justify-center pointer-events-none px-4 z-30">
          <span className="bg-black/75 backdrop-blur-sm text-yellow-300 font-semibold px-4 py-1.5 rounded-lg text-base sm:text-xl text-center shadow-lg tracking-wide border border-black/30">
            {getActiveSubtitleText()}
          </span>
        </div>
      )}

      {/* Tombol Lewati Intro (Skip Intro) */}
      {currentTime >= 4 && currentTime <= 25 && (
        <button
          onClick={handleSkipIntro}
          className="absolute bottom-28 right-6 md:right-12 z-40 bg-white/90 hover:bg-white text-black font-extrabold px-5 py-2.5 rounded-md shadow-2xl transition-all duration-200 flex items-center space-x-2 border border-gray-300 active:scale-95 cursor-pointer"
        >
          <FastForward className="w-4 h-4 fill-black" />
          <span className="text-sm tracking-wide">Lewati Intro</span>
        </button>
      )}

      {/* Tombol Episode Berikutnya saat mendekati akhir video */}
      {nextEpisode && currentTime >= duration - 30 && duration > 30 && (
        <div className="absolute top-20 right-6 md:right-12 z-40 bg-zinc-900/90 border border-zinc-700 p-4 rounded-xl shadow-2xl text-white max-w-xs animate-in fade-in slide-in-from-right-10 duration-300">
          <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">
            Episode Selanjutnya
          </p>
          <h4 className="font-bold text-sm truncate">{nextEpisode.title}</h4>
          <button
            onClick={() => handleSelectEpisode(nextEpisode)}
            className="mt-3 w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <span>Putar Episode Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overlay Kontrol Atas (Header & Back) */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white hover:text-gray-300 transition cursor-pointer p-2 rounded-lg bg-black/40 hover:bg-black/70 backdrop-blur-sm"
          title="Kembali ke Jelajah (Esc)"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold text-sm hidden sm:inline">Kembali</span>
        </button>

        <div className="text-center max-w-lg px-2">
          <h2 className="text-base sm:text-xl font-bold text-white drop-shadow truncate">
            {movie.title}
          </h2>
          {currentEpisode && (
            <p className="text-xs text-gray-300 mt-0.5 truncate">
              E{currentEpisode.episode_number}: {currentEpisode.title}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase hidden md:inline">
            {selectedQuality}
          </span>
          <span className="text-[#E50914] font-black tracking-widest text-lg hidden md:inline">
            FLIXORA
          </span>
        </div>
      </div>

      {/* Overlay Kontrol Bawah (Scrubber & Buttons) */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-3 transition-opacity duration-300 z-30 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrubber Timeline */}
        <div className="relative group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#E50914] group-hover:h-2.5 transition-all"
          />
          <div
            className="absolute top-0 left-0 h-1.5 bg-[#E50914] rounded-lg pointer-events-none group-hover:h-2.5 transition-all"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>

        {/* Baris Tombol Kontrol */}
        <div className="flex items-center justify-between text-white pt-1">
          {/* Tombol Kiri */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={togglePlay}
              className="text-white hover:text-red-400 transition cursor-pointer p-1"
              title={isPlaying ? "Jeda (Spasi)" : "Putar (Spasi)"}
            >
              {isPlaying ? <Pause className="w-6 h-6 md:w-7 md:h-7" /> : <Play className="w-6 h-6 md:w-7 md:h-7 fill-white" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="text-gray-300 hover:text-white transition cursor-pointer p-1"
              title="Mundur 10 detik"
            >
              <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="text-gray-300 hover:text-white transition cursor-pointer p-1"
              title="Maju 10 detik"
            >
              <RotateCw className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="flex items-center space-x-2 group">
              <button onClick={toggleMute} className="text-gray-300 hover:text-white transition cursor-pointer">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-red-400" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
              />
            </div>

            <span className="text-xs md:text-sm text-gray-300 font-mono hidden sm:inline">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Tombol Kanan (Fitur Tingkat Lanjut) */}
          <div className="flex items-center space-x-3 md:space-x-4 relative">
            {/* Drawer Episode untuk Serial TV */}
            {allEpisodes.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEpisodesDrawer(!showEpisodesDrawer);
                  setShowAudioSubMenu(false);
                  setShowSpeedMenu(false);
                }}
                className={`p-1.5 rounded transition cursor-pointer flex items-center space-x-1 ${
                  showEpisodesDrawer ? "text-[#E50914]" : "text-gray-300 hover:text-white"
                }`}
                title="Daftar Episode"
              >
                <ListVideo className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-xs font-semibold hidden md:inline">Episode</span>
              </button>
            )}

            {/* Menu Audio & Subtitle */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAudioSubMenu(!showAudioSubMenu);
                  setShowSpeedMenu(false);
                  setShowEpisodesDrawer(false);
                }}
                className={`p-1.5 rounded transition cursor-pointer ${
                  showAudioSubMenu ? "text-[#E50914]" : "text-gray-300 hover:text-white"
                }`}
                title="Audio & Subtitle"
              >
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Popup Audio & Subtitle */}
              {showAudioSubMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-12 right-0 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {/* Kolom Audio */}
                    <div>
                      <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2 text-[10px]">
                        Audio
                      </h4>
                      {["Bahasa Indonesia (Dolby 5.1)", "English (Original)", "Japanese"].map((aud) => (
                        <div
                          key={aud}
                          onClick={() => setSelectedAudio(aud)}
                          className="flex items-center justify-between py-1.5 cursor-pointer hover:text-white transition"
                        >
                          <span className={selectedAudio === aud ? "text-[#E50914] font-bold" : "text-gray-300"}>
                            {aud.split(" ")[0]}
                          </span>
                          {selectedAudio === aud && <Check className="w-3.5 h-3.5 text-[#E50914]" />}
                        </div>
                      ))}
                    </div>

                    {/* Kolom Subtitle */}
                    <div>
                      <h4 className="font-bold text-gray-400 uppercase tracking-wider mb-2 text-[10px]">
                        Subtitle
                      </h4>
                      {["Bahasa Indonesia", "English", "Mati"].map((sub) => (
                        <div
                          key={sub}
                          onClick={() => setSelectedSubtitle(sub)}
                          className="flex items-center justify-between py-1.5 cursor-pointer hover:text-white transition"
                        >
                          <span className={selectedSubtitle === sub ? "text-[#E50914] font-bold" : "text-gray-300"}>
                            {sub}
                          </span>
                          {selectedSubtitle === sub && <Check className="w-3.5 h-3.5 text-[#E50914]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Kecepatan Putar (Playback Speed) */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowAudioSubMenu(false);
                  setShowEpisodesDrawer(false);
                }}
                className={`p-1.5 rounded transition cursor-pointer text-xs font-bold border border-zinc-700 px-2 py-0.5 ${
                  showSpeedMenu ? "border-[#E50914] text-[#E50914]" : "text-gray-300 hover:text-white"
                }`}
                title="Kecepatan Putar"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-12 right-0 w-36 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-2 text-xs z-50 animate-in fade-in zoom-in-95"
                >
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider px-2 py-1 text-[10px]">
                    Kecepatan
                  </h4>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <div
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition ${
                        playbackSpeed === spd ? "bg-red-950/40 text-red-400 font-bold" : "hover:bg-zinc-800 text-gray-300"
                      }`}
                    >
                      <span>{spd === 1 ? "1x (Normal)" : `${spd}x`}</span>
                      {playbackSpeed === spd && <Check className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-gray-300 hover:text-white transition cursor-pointer p-1"
              title="Layar Penuh (F)"
            >
              {isFullscreen ? <Minimize className="w-5 h-5 md:w-6 md:h-6" /> : <Maximize className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Episode Pop-up Samping */}
      {showEpisodesDrawer && allEpisodes.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-zinc-950/95 border-l border-zinc-800 p-6 overflow-y-auto z-50 shadow-2xl animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-base text-white">Daftar Episode</h3>
            <button
              onClick={() => setShowEpisodesDrawer(false)}
              className="text-gray-400 hover:text-white transition text-xs font-semibold"
            >
              Tutup
            </button>
          </div>

          <div className="space-y-3">
            {allEpisodes.map((ep) => {
              const isCurrent = currentEpisode?.id === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEpisode(ep)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex flex-col space-y-1.5 ${
                    isCurrent
                      ? "bg-red-950/30 border-[#E50914] text-white"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      E{ep.episode_number}: {ep.title}
                    </span>
                    <span className="text-[10px] text-gray-400">{ep.duration}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {ep.overview}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
