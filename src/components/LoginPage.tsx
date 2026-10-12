"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Film, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginPageProps {
  initialMode?: "login" | "register";
  initialEmail?: string;
  onBack: () => void;
}

export default function LoginPage({
  initialMode = "login",
  initialEmail = "",
  onBack,
}: LoginPageProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Silakan masukkan email dan kata sandi yang valid.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("Silakan masukkan nama lengkap Anda.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi harus terdiri dari 6 karakter atau lebih.");
      return;
    }

    if (mode === "login") {
      login(email.trim(), password);
    } else {
      register(name.trim(), email.trim(), password);
    }
  };

  const handleDemoLogin = () => {
    login("demo@flixora.com", "password123");
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-between selection:bg-[#E50914] selection:text-white animate-page-transition">
      {/* Background Poster Montage Sinematik */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80"
          alt="Login Background"
          fill
          priority
          unoptimized
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 px-6 md:px-16 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div onClick={onBack} className="flex items-center space-x-2 cursor-pointer">
          <Film className="w-8 h-8 text-[#E50914]" />
          <span className="text-[#E50914] text-2xl md:text-3xl font-black tracking-widest uppercase">
            FLIXORA
          </span>
        </div>

        <button
          onClick={onBack}
          className="text-gray-300 hover:text-white flex items-center space-x-1.5 text-xs sm:text-sm font-semibold transition bg-black/50 px-3 py-1.5 rounded-lg border border-zinc-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </header>

      {/* Kartu Form Login Tengah */}
      <main className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="bg-black/80 border border-zinc-800 backdrop-blur-md rounded-2xl w-full max-w-md p-8 sm:p-12 shadow-2xl text-white animate-in zoom-in-95 duration-200">
          <h1 className="text-2xl sm:text-3xl font-black mb-7">
            {mode === "login" ? "Masuk" : "Daftar Akun Baru"}
          </h1>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-orange-600/90 text-white text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email atau nomor telepon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1"
                title={showPassword ? "Sembunyikan Sandi" : "Tampilkan Sandi"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-3.5 rounded-lg text-sm sm:text-base transition shadow-lg mt-3 cursor-pointer active:scale-98"
            >
              {mode === "login" ? "Masuk" : "Daftar Sekarang"}
            </button>
          </form>

          {/* Opsi Ingat Saya & Akses Demo Cepat */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="rounded accent-red-600" />
              <span>Ingat saya</span>
            </label>
            <span className="hover:underline cursor-pointer">Perlu bantuan?</span>
          </div>

          {/* Tombol Demo Cepat 1-Klik */}
          <div className="mt-6 pt-5 border-t border-zinc-800 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full inline-flex items-center justify-center space-x-2 text-xs text-amber-300 font-semibold py-2.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Masuk Cepat: Akun Demo VIP (1-Klik)</span>
            </button>
          </div>

          {/* Tautan Peralihan Masuk / Daftar */}
          <div className="mt-6 text-sm text-gray-400">
            {mode === "login" ? (
              <p>
                Baru di Flixora?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  className="text-white font-bold hover:underline ml-1 cursor-pointer"
                >
                  Daftar sekarang.
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="text-white font-bold hover:underline ml-1 cursor-pointer"
                >
                  Masuk sekarang.
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="relative z-20 px-6 py-6 border-t border-zinc-900 bg-black/80 text-gray-500 text-xs text-center">
        <p>© 2026 Flixora Indonesia. Halaman masuk dan otentikasi resmi.</p>
      </footer>
    </div>
  );
}
