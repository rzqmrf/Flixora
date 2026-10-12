"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { WatchHistoryItem } from "@/types/user";
import { Movie } from "@/types/movie";
import { useAuth } from "./AuthContext";

interface WatchHistoryContextType {
  history: WatchHistoryItem[];
  updateProgress: (
    movieId: number,
    progressSeconds: number,
    durationSeconds: number,
    episodeId?: number,
    episodeTitle?: string,
    seasonNumber?: number
  ) => void;
  getProgress: (movieId: number) => WatchHistoryItem | undefined;
  removeFromHistory: (movieId: number) => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

export function WatchHistoryProvider({ children }: { children: React.ReactNode }) {
  const { currentProfile } = useAuth();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  // Muat history tontonan khusus profil yang sedang aktif
  useEffect(() => {
    if (!currentProfile) {
      setHistory([]);
      return;
    }

    try {
      const saved = localStorage.getItem(`flixora_history_${currentProfile.id}`);
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        // Sample default continue watching untuk demo instan yang kaya
        const sampleHistory: WatchHistoryItem[] = [
          {
            movieId: 1, // Stranger Things
            episodeId: 101,
            seasonNumber: 1,
            episodeTitle: "Babak Satu: Hilangnya Will Byers",
            progressSeconds: 1420,
            durationSeconds: 2880,
            lastWatched: new Date().toISOString(),
          },
          {
            movieId: 3, // Dune 2
            progressSeconds: 3800,
            durationSeconds: 9960,
            lastWatched: new Date(Date.now() - 3600000).toISOString(),
          },
        ];
        setHistory(sampleHistory);
        localStorage.setItem(`flixora_history_${currentProfile.id}`, JSON.stringify(sampleHistory));
      }
    } catch {
      setHistory([]);
    }
  }, [currentProfile]);

  const updateProgress = (
    movieId: number,
    progressSeconds: number,
    durationSeconds: number,
    episodeId?: number,
    episodeTitle?: string,
    seasonNumber?: number
  ) => {
    if (!currentProfile || durationSeconds <= 0) return;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.movieId !== movieId);
      const newItem: WatchHistoryItem = {
        movieId,
        episodeId,
        episodeTitle,
        seasonNumber,
        progressSeconds,
        durationSeconds,
        lastWatched: new Date().toISOString(),
      };
      const updated = [newItem, ...filtered];
      try {
        localStorage.setItem(`flixora_history_${currentProfile.id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const getProgress = (movieId: number): WatchHistoryItem | undefined => {
    return history.find((item) => item.movieId === movieId);
  };

  const removeFromHistory = (movieId: number) => {
    if (!currentProfile) return;
    setHistory((prev) => {
      const updated = prev.filter((item) => item.movieId !== movieId);
      try {
        localStorage.setItem(`flixora_history_${currentProfile.id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <WatchHistoryContext.Provider
      value={{
        history,
        updateProgress,
        getProgress,
        removeFromHistory,
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory() {
  const context = useContext(WatchHistoryContext);
  if (!context) throw new Error("useWatchHistory must be used within WatchHistoryProvider");
  return context;
}
