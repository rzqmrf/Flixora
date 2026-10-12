"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, Film, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!isAuthModalOpen && isAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Harap isi semua kolom.");
      return;
    }

    if (mode === "register" && !name) {
      setError("Harap masukkan nama lengkap Anda.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    if (mode === "login") {
      login(email, password);
    } else {
      register(name, email, password);
    }
  };

  const handleDemoLogin = () => {
    login("demo@flixora.com", "password123");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-[#181818] border border-zinc-700/80 rounded-xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Tombol Close jika sudah login */}
        {isAuthenticated && (
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Film className="w-8 h-8 text-[#E50914]" />
            <span className="text-2xl font-black tracking-widest text-[#E50914]">FLIXORA</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm text-center">
            Streaming film bioskop dan serial TV premium tanpa batas.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-700 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 ${
              mode === "login"
                ? "border-[#E50914] text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition border-b-2 ${
              mode === "register"
                ? "border-[#E50914] text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Form Formulir */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Nama Lengkap</label>
              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus-within:border-red-500">
                <User className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
            <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus-within:border-red-500">
              <Mail className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="email"
                placeholder="email@anda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-sm w-full focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Kata Sandi</label>
            <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus-within:border-red-500">
              <Lock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-sm w-full focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-sm transition shadow-lg mt-2 cursor-pointer active:scale-98"
          >
            {mode === "login" ? "Masuk ke Flixora" : "Buat Akun Sekarang"}
          </button>
        </form>

        {/* Demo Fast Access */}
        <div className="mt-6 pt-5 border-t border-zinc-800 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="inline-flex items-center space-x-2 text-xs text-amber-400 hover:text-amber-300 transition py-1 px-3 rounded-full bg-amber-400/10 border border-amber-400/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coba Cepat: Masuk Akun Demo Otomatis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
