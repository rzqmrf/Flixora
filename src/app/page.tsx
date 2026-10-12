"use client";

import React, { useState, useMemo } from "react";
import Navbar, { NavTab } from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import MovieModal from "@/components/MovieModal";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import ProfileSelectorModal from "@/components/ProfileSelectorModal";
import SubscriptionModal from "@/components/SubscriptionModal";
import WatchPlayer from "@/components/WatchPlayer";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import LandingPage from "@/components/LandingPage";
import LoginPage from "@/components/LoginPage";
import { ALL_CATALOG } from "@/lib/tmdb";
import { Movie } from "@/types/movie";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { Film, Bookmark, Sparkles } from "lucide-react";

export default function Home() {
  const { isAuthenticated, currentProfile } = useAuth();
  const { watchlist } = useWatchlist();

  // State Halaman untuk Tamu (Sebelum Login)
  const [guestView, setGuestView] = useState<"landing" | "login" | "register">("landing");
  const [initialEmail, setInitialEmail] = useState("");

  // State Dasbor Anggota
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // State Pemutar Video WatchPlayer
  const [activePlayingMovie, setActivePlayingMovie] = useState<Movie | null>(null);
  const [initialPlayTime, setInitialPlayTime] = useState<number>(0);
  const [initialEpisodeId, setInitialEpisodeId] = useState<number | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter profil anak-anak (Kids Mode)
  const baseCatalog = useMemo(() => {
    if (currentProfile?.isKids) {
      return ALL_CATALOG.filter((m) => m.isKids || m.maturity_rating !== "18+");
    }
    return ALL_CATALOG;
  }, [currentProfile]);

  // Filter berdasarkan Tab Navigasi Aktif
  const tabFilteredMovies = useMemo(() => {
    switch (activeTab) {
      case "tv":
        return baseCatalog.filter((m) => m.media_type === "tv");
      case "movies":
        return baseCatalog.filter((m) => m.media_type === "movie");
      case "trending":
        return [...baseCatalog].sort((a, b) => b.vote_average - a.vote_average);
      case "watchlist":
        return watchlist;
      case "home":
      default:
        return baseCatalog;
    }
  }, [activeTab, baseCatalog, watchlist]);

  // Filter berdasarkan Genre & Sorting
  const filteredMovies = useMemo(() => {
    let result = [...tabFilteredMovies];

    // Filter Genre
    if (selectedGenre !== "Semua") {
      result = result.filter((m) =>
        m.genres?.some((g) => g.name.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "rating") {
      result.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === "latest") {
      result.sort((a, b) => {
        const dateA = a.release_date || a.first_air_date || "";
        const dateB = b.release_date || b.first_air_date || "";
        return dateB.localeCompare(dateA);
      });
    }

    return result;
  }, [tabFilteredMovies, selectedGenre, sortBy]);

  // Filter Pencarian Real-Time
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return baseCatalog.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.overview.toLowerCase().includes(query) ||
        m.genres?.some((g) => g.name.toLowerCase().includes(query)) ||
        m.cast?.some((c) => c.toLowerCase().includes(query))
    );
  }, [searchQuery, baseCatalog]);

  // Film Unggulan untuk Hero Banner
  const heroMovie = useMemo(() => {
    if (activeTab === "tv") {
      return baseCatalog.find((m) => m.media_type === "tv") || baseCatalog[0];
    }
    if (activeTab === "movies") {
      return baseCatalog.find((m) => m.media_type === "movie") || baseCatalog[0];
    }
    return baseCatalog[0];
  }, [activeTab, baseCatalog]);

  // Kategori dinamis untuk Tampilan Beranda
  const categories = useMemo(() => {
    return [
      {
        title: "Sedang Hangat di Flixora",
        movies: baseCatalog.slice(0, 6),
      },
      {
        title: "Serial TV Paling Banyak Ditonton",
        movies: baseCatalog.filter((m) => m.media_type === "tv"),
      },
      {
        title: "Film Bioskop Blockbuster Pilihan",
        movies: baseCatalog.filter((m) => m.media_type === "movie"),
      },
      {
        title: "Karya Bernilai Seni & Rating Tertinggi",
        movies: [...baseCatalog].sort((a, b) => b.vote_average - a.vote_average).slice(0, 6),
      },
      {
        title: "Laga, Misteri & Sci-Fi",
        movies: baseCatalog.filter((m) =>
          m.genres?.some((g) => ["Action", "Sci-Fi", "Misteri"].includes(g.name))
        ),
      },
    ];
  }, [baseCatalog]);

  // Putar Acak (Surprise Me)
  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * baseCatalog.length);
    const randomMovie = baseCatalog[randomIndex];
    setInitialPlayTime(0);
    setInitialEpisodeId(undefined);
    setActivePlayingMovie(randomMovie);
  };

  // Mulai memutar film dari awal
  const handlePlayMovie = (movie: Movie, episodeId?: number) => {
    setInitialPlayTime(0);
    setInitialEpisodeId(episodeId);
    setActivePlayingMovie(movie);
  };

  // Lanjutkan menonton dari posisi tersimpan
  const handleResumeMovie = (movie: Movie, startTime: number, episodeId?: number) => {
    setInitialPlayTime(startTime);
    setInitialEpisodeId(episodeId);
    setActivePlayingMovie(movie);
  };

  // JIKA PENGGUNA BELUM LOGIN (GUEST MODE)
  if (!isAuthenticated) {
    if (guestView === "login" || guestView === "register") {
      return (
        <LoginPage
          initialMode={guestView}
          initialEmail={initialEmail}
          onBack={() => setGuestView("landing")}
        />
      );
    }

    return (
      <LandingPage
        onGoToLogin={() => setGuestView("login")}
        onStartEmail={(email) => {
          setInitialEmail(email);
          setGuestView("register");
        }}
      />
    );
  }

  // JIKA SEDANG MENONTON DI WATCHPLAYER
  if (activePlayingMovie) {
    return (
      <WatchPlayer
        movie={activePlayingMovie}
        initialTime={initialPlayTime}
        initialEpisodeId={initialEpisodeId}
        onBack={() => {
          setActivePlayingMovie(null);
          setInitialPlayTime(0);
          setInitialEpisodeId(undefined);
        }}
      />
    );
  }

  const isGridDisplay =
    searchQuery.trim() !== "" ||
    activeTab === "watchlist" ||
    activeTab === "tv" ||
    activeTab === "movies" ||
    activeTab === "trending" ||
    selectedGenre !== "Semua";

  // DASBOR UTAMA ANGGOTA (MEMBER BROWSE DASHBOARD)
  return (
    <div className="relative min-h-screen bg-[#141414] text-white selection:bg-[#E50914] selection:text-white pb-20 animate-page-transition">
      {/* Navbar Flixora */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedGenre("Semua");
          setSearchQuery("");
        }}
        onSearch={setSearchQuery}
        onSurpriseMe={handleSurpriseMe}
        searchQuery={searchQuery}
      />

      {/* Tampilan Pencarian */}
      {searchQuery.trim() ? (
        <main className="pt-24 px-4 md:px-12 min-h-[70vh]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-200">
              Hasil pencarian: <span className="text-[#E50914]">&quot;{searchQuery}&quot;</span>
            </h1>
            <span className="text-xs text-gray-400">{searchResults.length} judul ditemukan</span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map((movie) => (
                <div key={movie.id} className="flex justify-center">
                  <MovieCard
                    movie={movie}
                    onOpenModal={setSelectedMovie}
                    onPlayMovie={handlePlayMovie}
                    isLarge={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-gray-400 space-y-3">
              <Film className="w-12 h-12 mx-auto text-zinc-600" />
              <p className="text-lg font-semibold">Tidak ada film yang cocok dengan pencarian Anda.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Coba cari dengan nama aktor (misal: Keanu Reeves, Zendaya) atau genre (Action, Sci-Fi).
              </p>
            </div>
          )}
        </main>
      ) : isGridDisplay ? (
        /* Tampilan Tab Khusus / Filter Aktif (Katalog Grid) */
        <main className="pt-20">
          <div className="px-4 md:px-12 pt-4 pb-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold flex items-center space-x-2">
                {activeTab === "watchlist" && <Bookmark className="w-6 h-6 text-[#E50914]" />}
                {activeTab === "trending" && <Sparkles className="w-6 h-6 text-amber-400" />}
                <span>
                  {activeTab === "watchlist"
                    ? "Daftar Tontonan Saya"
                    : activeTab === "tv"
                    ? "Semua Serial TV"
                    : activeTab === "movies"
                    ? "Koleksi Film Layar Lebar"
                    : activeTab === "trending"
                    ? "Sedang Baru & Populer"
                    : `Katalog Genre: ${selectedGenre}`}
                </span>
              </h1>
              <span className="text-xs text-gray-400 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700">
                {filteredMovies.length} Judul Tersedia
              </span>
            </div>
          </div>

          <GenreFilter
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
            sortBy={sortBy}
            onSelectSortBy={setSortBy}
          />

          <div className="px-4 md:px-12 py-8 min-h-[60vh]">
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="flex justify-center">
                    <MovieCard
                      movie={movie}
                      onOpenModal={setSelectedMovie}
                      onPlayMovie={handlePlayMovie}
                      isLarge={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center text-gray-400 space-y-3">
                <Bookmark className="w-12 h-12 mx-auto text-zinc-600" />
                <p className="text-lg font-semibold">
                  {activeTab === "watchlist"
                    ? "Daftar tontonan Anda masih kosong."
                    : "Tidak ada film yang sesuai dengan filter ini."}
                </p>
                {activeTab === "watchlist" && (
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Klik tombol tanda tambah (+) pada film apa pun untuk menyimpannya ke daftar tontonan pribadi Anda.
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      ) : (
        /* Tampilan Beranda Penuh (Hero Banner + Lanjutkan Menonton + Baris Kategori Carousel) */
        <main>
          {/* Banner Utama */}
          <HeroBanner
            movie={heroMovie}
            onOpenModal={setSelectedMovie}
            onPlayMovie={handlePlayMovie}
          />

          {/* Bar Filter Genre Cepat */}
          <div className="relative z-20 -mt-8 mb-4">
            <GenreFilter
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
              sortBy={sortBy}
              onSelectSortBy={setSortBy}
            />
          </div>

          {/* Baris Lanjutkan Menonton */}
          <div className="relative z-20">
            <ContinueWatchingRow
              movies={baseCatalog}
              onPlayResume={handleResumeMovie}
              onOpenModal={setSelectedMovie}
            />
          </div>

          {/* Baris Kategori Film */}
          <div className="relative z-20 space-y-4">
            {categories.map((category, index) => (
              <MovieRow
                key={category.title}
                title={category.title}
                movies={category.movies}
                onOpenModal={setSelectedMovie}
                onPlayMovie={handlePlayMovie}
                isLarge={index === 1}
              />
            ))}
          </div>
        </main>
      )}

      {/* Footer Resmi Flixora */}
      <footer className="mt-24 px-4 md:px-12 max-w-6xl mx-auto text-gray-500 text-xs space-y-5 border-t border-zinc-800/80 pt-10">
        <div className="flex items-center space-x-2 text-white">
          <Film className="w-5 h-5 text-[#E50914]" />
          <span className="font-extrabold text-base tracking-widest text-[#E50914]">FLIXORA</span>
          <span className="text-gray-400 text-xs">Streaming Platform Next-Gen</span>
        </div>
        <p className="hover:underline cursor-pointer">Layanan Bantuan Pelanggan 24/7: support@flixora.com</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-400">
          <span className="hover:underline cursor-pointer">Pusat Bantuan</span>
          <span className="hover:underline cursor-pointer">Fitur Premium</span>
          <span className="hover:underline cursor-pointer">Privasi & Keamanan</span>
          <span className="hover:underline cursor-pointer">Pengaturan Profil</span>
          <span className="hover:underline cursor-pointer">Ketentuan Layanan</span>
          <span className="hover:underline cursor-pointer">Kemitraan Konten</span>
          <span className="hover:underline cursor-pointer">Uji Cepat Jaringan</span>
          <span className="hover:underline cursor-pointer">Informasi Hak Cipta</span>
        </div>
        <div className="pt-4 border-t border-zinc-800/60 text-gray-500">
          <p>© 2026 Flixora Cinema Networks. Platform streaming hiburan interaktif modern.</p>
        </div>
      </footer>

      {/* Modal Detail & Pemutar Video Trailer */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={setSelectedMovie}
        onPlayMovie={handlePlayMovie}
      />

      {/* Modal Pemilih Multi-Profil */}
      <ProfileSelectorModal />

      {/* Modal Paket Langganan & VIP */}
      <SubscriptionModal />
    </div>
  );
}
