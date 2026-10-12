"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { useAuth } from "./AuthContext";

interface WatchlistContextType {
  watchlist: Movie[];
  likedMovieIds: number[];
  isInWatchlist: (movieId: number) => boolean;
  toggleWatchlist: (movie: Movie) => void;
  isLiked: (movieId: number) => boolean;
  toggleLike: (movieId: number) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { currentProfile } = useAuth();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [likedMovieIds, setLikedMovieIds] = useState<number[]>([]);

  // Muat watchlist spesifik untuk profil yang sedang aktif
  useEffect(() => {
    if (!currentProfile) {
      setWatchlist([]);
      setLikedMovieIds([]);
      return;
    }

    try {
      const savedList = localStorage.getItem(`flixora_watchlist_${currentProfile.id}`);
      if (savedList) {
        setWatchlist(JSON.parse(savedList));
      } else {
        setWatchlist([]);
      }

      const savedLikes = localStorage.getItem(`flixora_likes_${currentProfile.id}`);
      if (savedLikes) {
        setLikedMovieIds(JSON.parse(savedLikes));
      } else {
        setLikedMovieIds([]);
      }
    } catch {
      setWatchlist([]);
      setLikedMovieIds([]);
    }
  }, [currentProfile]);

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const toggleWatchlist = (movie: Movie) => {
    if (!currentProfile) return;

    let updated: Movie[];
    if (isInWatchlist(movie.id)) {
      updated = watchlist.filter((m) => m.id !== movie.id);
    } else {
      updated = [movie, ...watchlist];
    }
    setWatchlist(updated);
    localStorage.setItem(`flixora_watchlist_${currentProfile.id}`, JSON.stringify(updated));
  };

  const isLiked = (movieId: number) => {
    return likedMovieIds.includes(movieId);
  };

  const toggleLike = (movieId: number) => {
    if (!currentProfile) return;

    let updated: number[];
    if (isLiked(movieId)) {
      updated = likedMovieIds.filter((id) => id !== movieId);
    } else {
      updated = [...likedMovieIds, movieId];
    }
    setLikedMovieIds(updated);
    localStorage.setItem(`flixora_likes_${currentProfile.id}`, JSON.stringify(updated));
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        likedMovieIds,
        isInWatchlist,
        toggleWatchlist,
        isLiked,
        toggleLike,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error("useWatchlist must be used within WatchlistProvider");
  return context;
}
