"use client";

import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSelectorModal() {
  const {
    user,
    currentProfile,
    isProfileModalOpen,
    setIsProfileModalOpen,
    switchProfile,
    addProfile,
  } = useAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [isKids, setIsKids] = useState(false);

  if (!isProfileModalOpen || !user) return null;

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    addProfile(newProfileName.trim(), isKids);
    setNewProfileName("");
    setIsKids(false);
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      {/* Tombol Tutup */}
      <button
        onClick={() => setIsProfileModalOpen(false)}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-2 cursor-pointer"
        title="Tutup"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-2xl w-full flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-12">
          Siapa yang sedang menonton?
        </h1>

        {/* Daftar Kartu Profil */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-10">
          {user.profiles.map((profile) => {
            const isSelected = profile.id === currentProfile?.id;
            return (
              <div
                key={profile.id}
                onClick={() => switchProfile(profile.id)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-gradient-to-tr ${profile.avatar} flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:ring-4 group-hover:ring-white/80 ${
                    isSelected ? "ring-4 ring-[#E50914]" : ""
                  }`}
                >
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>

                  {profile.isKids && (
                    <span className="absolute bottom-1 right-1 bg-amber-400 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                      KIDS
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-[#E50914] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <span
                  className={`mt-3 text-sm sm:text-base font-medium transition ${
                    isSelected
                      ? "text-white font-bold"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                >
                  {profile.name}
                </span>
              </div>
            );
          })}

          {/* Tombol Tambah Profil Baru */}
          {!isAdding && user.profiles.length < 5 && (
            <div
              onClick={() => setIsAdding(true)}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-2 border-dashed border-gray-600 group-hover:border-white flex items-center justify-center transition-all duration-200 group-hover:scale-105">
                <Plus className="w-10 h-10 text-gray-500 group-hover:text-white transition" />
              </div>
              <span className="mt-3 text-sm sm:text-base text-gray-400 group-hover:text-white transition font-medium">
                Tambah Profil
              </span>
            </div>
          )}
        </div>

        {/* Form Tambah Profil */}
        {isAdding && (
          <form
            onSubmit={handleAddProfile}
            className="bg-zinc-900 border border-zinc-700 p-5 rounded-xl max-w-sm w-full space-y-4 mb-6"
          >
            <h3 className="text-white font-semibold text-sm">Buat Profil Baru</h3>
            <input
              type="text"
              placeholder="Nama Profil"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              autoFocus
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
            />
            <label className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isKids}
                onChange={(e) => setIsKids(e.target.checked)}
                className="rounded accent-red-600"
              />
              <span>Profil Khusus Anak-anak (Kids Mode)</span>
            </label>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-[#E50914] hover:bg-red-700 text-white py-1.5 rounded-lg text-xs font-bold transition"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-1.5 rounded-lg text-xs transition"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
