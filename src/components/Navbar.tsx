"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  X,
  Film,
  ChevronDown,
  User,
  LogOut,
  CheckSquare,
  Sparkles,
  Crown,
  Shuffle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";

export type NavTab = "home" | "tv" | "movies" | "trending" | "watchlist";

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onSearch: (query: string) => void;
  onSurpriseMe: () => void;
  searchQuery: string;
}

export default function Navbar({
  activeTab,
  onSelectTab,
  onSearch,
  onSurpriseMe,
  searchQuery,
}: NavbarProps) {
  const {
    user,
    currentProfile,
    logout,
    setIsProfileModalOpen,
    setIsAuthModalOpen,
    setIsSubscriptionModalOpen,
    isAuthenticated,
  } = useAuth();
  const { watchlist } = useWatchlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between ${
        isScrolled
          ? "bg-[#141414]/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-black/85 via-black/45 to-transparent"
      }`}
    >
      {/* Kiri: Brand FLIXORA & Navigasi Tab */}
      <div className="flex items-center space-x-4 md:space-x-8">
        <div
          onClick={() => {
            onSelectTab("home");
            onSearch("");
          }}
          className="flex items-center space-x-1.5 cursor-pointer select-none group"
        >
          <Film className="w-6 h-6 md:w-7 md:h-7 text-[#E50914] group-hover:scale-110 transition-transform" />
          <span className="text-[#E50914] text-xl md:text-2xl font-black tracking-widest uppercase font-sans">
            FLIXORA
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-5 text-xs md:text-sm">
          <button
            onClick={() => onSelectTab("home")}
            className={`transition font-medium cursor-pointer ${
              activeTab === "home" ? "text-white font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onSelectTab("tv")}
            className={`transition font-medium cursor-pointer ${
              activeTab === "tv" ? "text-white font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            Serial TV
          </button>
          <button
            onClick={() => onSelectTab("movies")}
            className={`transition font-medium cursor-pointer ${
              activeTab === "movies" ? "text-white font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            Film
          </button>
          <button
            onClick={() => onSelectTab("trending")}
            className={`transition font-medium cursor-pointer ${
              activeTab === "trending" ? "text-white font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            Baru & Populer
          </button>
          <button
            onClick={() => onSelectTab("watchlist")}
            className={`transition font-medium cursor-pointer relative flex items-center space-x-1 ${
              activeTab === "watchlist" ? "text-white font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            <span>Daftar Saya</span>
            {watchlist.length > 0 && (
              <span className="bg-[#E50914] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                {watchlist.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Kanan: Fitur Putar Acak, Search, Notifikasi, Akun & Profil */}
      <div className="flex items-center space-x-3 md:space-x-4 text-white">
        {/* Tombol Putar Acak (Surprise Me) */}
        <button
          onClick={onSurpriseMe}
          className="hidden sm:flex items-center space-x-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-gray-200 hover:text-white border border-zinc-700/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
          title="Putar Acak Film Pilihan"
        >
          <Shuffle className="w-3.5 h-3.5 text-red-500" />
          <span>Putar Acak</span>
        </button>

        {/* Search Bar */}
        <div className="flex items-center">
          {showSearchInput ? (
            <div className="flex items-center bg-black/80 border border-gray-600 rounded-lg px-2.5 py-1 text-xs md:text-sm w-44 md:w-60 transition-all">
              <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Cari film, serial, aktor..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                autoFocus
                className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full text-xs"
              />
              <button
                onClick={() => {
                  setShowSearchInput(false);
                  onSearch("");
                }}
                className="text-gray-400 hover:text-white ml-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="text-gray-300 hover:text-white transition p-1.5 cursor-pointer"
              title="Cari"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tombol Upgrade VIP */}
        <button
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="hidden lg:flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/50 hover:border-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 transition cursor-pointer"
          title="Kelola Paket Langganan VIP"
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>{user?.subscriptionPlan || "VIP Pass"}</span>
        </button>

        {/* Notifikasi */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative text-gray-300 hover:text-white transition p-1.5 cursor-pointer"
            title="Pemberitahuan"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#E50914] rounded-full"></span>
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-3 w-72 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl p-3 text-xs space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="font-bold text-gray-200 border-b border-zinc-800 pb-2 flex items-center justify-between">
                <span>Pemberitahuan Terbaru</span>
                <span className="text-[10px] text-gray-400">Hari Ini</span>
              </div>
              <div className="p-2 hover:bg-zinc-800/80 rounded transition cursor-pointer">
                <p className="font-semibold text-white">Stranger Things: Babak Baru Rilis</p>
                <p className="text-gray-400 text-[11px]">Episode 1-3 kini siap ditonton dalam kualitas 4K HDR.</p>
              </div>
              <div className="p-2 hover:bg-zinc-800/80 rounded transition cursor-pointer">
                <p className="font-semibold text-white">Paket VIP Anda Aktif</p>
                <p className="text-gray-400 text-[11px]">Akses streaming tanpa batas dan unduhan offline aktif.</p>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Profil Pengguna */}
        {isAuthenticated && currentProfile ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-1.5 cursor-pointer p-1 rounded-md hover:bg-zinc-800/60 transition"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-tr ${currentProfile.avatar} flex items-center justify-center font-bold text-xs shadow-inner`}
              >
                <span>{currentProfile.name.charAt(0).toUpperCase()}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-60 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl py-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header Profil */}
                <div className="px-4 py-2.5 border-b border-zinc-800">
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <div
                      className={`w-7 h-7 rounded bg-gradient-to-tr ${currentProfile.avatar} flex items-center justify-center font-bold text-xs`}
                    >
                      <span>{currentProfile.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-white truncate">{currentProfile.name}</p>
                      <p className="text-gray-400 text-[10px] truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-zinc-800/70 px-2 py-1 rounded text-[10px] mt-1">
                    <span className="text-gray-400">Status Langganan:</span>
                    <span className="text-amber-400 font-bold">{user?.subscriptionPlan}</span>
                  </div>
                </div>

                {/* Aksi Menu */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setIsSubscriptionModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-zinc-800 flex items-center space-x-2 text-amber-300 transition cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Paket Langganan & VIP</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-zinc-800 flex items-center space-x-2 text-gray-200 hover:text-white transition cursor-pointer"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Ganti / Kelola Profil</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSelectTab("watchlist");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-zinc-800 flex items-center space-x-2 text-gray-200 hover:text-white transition cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4 text-gray-400" />
                    <span>Daftar Tontonan Saya</span>
                  </button>

                  <div className="border-t border-zinc-800 my-1"></div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-950/40 text-red-400 hover:text-red-300 flex items-center space-x-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Flixora</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded transition cursor-pointer"
          >
            Masuk
          </button>
        )}
      </div>
    </header>
  );
}
