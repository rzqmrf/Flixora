"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Film, ChevronRight, Plus, X, Globe, Tv, Download, MonitorPlay, Users } from "lucide-react";

interface LandingPageProps {
  onGoToLogin: () => void;
  onStartEmail: (email: string) => void;
}

const FAQS = [
  {
    q: "Apa itu Flixora?",
    a: "Flixora adalah layanan streaming hiburan terdepan yang menawarkan beragam pilihan serial TV pemenang penghargaan, film layar lebar, animasi, dokumenter, dan banyak lagi di ribuan perangkat yang tersambung ke Internet. Anda bisa menonton sepuasnya, kapan pun Anda mau, tanpa jeda satu iklan pun.",
  },
  {
    q: "Berapa biaya berlangganan Flixora?",
    a: "Tonton Flixora di ponsel pintar, tablet, Smart TV, laptop, atau perangkat streaming Anda, semuanya dengan satu biaya bulanan yang terjangkau. Mulai dari Rp 54.000 hingga Rp 186.000 per bulan. Tanpa biaya ekstra, tanpa kontrak jangka panjang.",
  },
  {
    q: "Di mana saya bisa menonton?",
    a: "Tonton di mana pun, kapan pun. Masuk ke akun Flixora Anda untuk langsung menonton secara instan melalui web di komputer pribadi atau di perangkat apa pun yang tersambung ke Internet, termasuk smart TV, smartphone, tablet, konsol game, dan media player.",
  },
  {
    q: "Bagaimana cara membatalkan?",
    a: "Flixora sangat fleksibel. Tidak ada ikatan kontrak yang merepotkan dan tidak ada komitmen. Anda bisa dengan mudah membatalkan akun Anda secara online dalam dua klik saja. Tanpa biaya pembatalan—mulai atau hentikan akun Anda kapan pun.",
  },
  {
    q: "Apa yang bisa saya tonton di Flixora?",
    a: "Flixora memiliki pustaka lengkap yang berisi film bioskop berperingkat tinggi, serial drama eksklusif orisinal, anime populer, konten pemenang penghargaan, dan banyak lagi. Tonton sepuasnya kapan pun Anda mau.",
  },
];

export default function LandingPage({ onGoToLogin, onStartEmail }: LandingPageProps) {
  const [email, setEmail] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onStartEmail(email.trim());
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#E50914] selection:text-white animate-page-transition">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between border-b-8 border-zinc-800">
        {/* Background Image Poster Montage dengan Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80"
            alt="Flixora Background Montage"
            fill
            priority
            unoptimized
            className="object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-radial from-transparent to-black/80" />
        </div>

        {/* Top Navbar */}
        <header className="relative z-20 px-6 md:px-16 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-[#E50914]" />
            <span className="text-[#E50914] text-2xl md:text-3xl font-black tracking-widest uppercase">
              FLIXORA
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-black/60 border border-gray-600 rounded-md px-2.5 py-1 text-xs text-gray-300">
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              <span>Bahasa Indonesia</span>
            </div>

            <button
              onClick={onGoToLogin}
              className="bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 rounded transition shadow-md cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto my-auto py-16 space-y-5">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Film, serial TV, dan banyak lagi tak terbatas.
          </h1>
          <p className="text-lg sm:text-2xl text-gray-200 font-medium">
            Tonton di mana pun. Batalkan kapan pun.
          </p>
          <p className="text-sm sm:text-lg text-gray-300 max-w-xl">
            Siap menonton? Masukkan email Anda untuk membuat atau memulai keanggotaan.
          </p>

          {/* Form Input Email & Tombol Mulai */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl pt-2"
          >
            <input
              type="email"
              placeholder="Alamat email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:flex-1 bg-black/70 border border-gray-500 rounded-md px-4 py-3.5 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#E50914] hover:bg-red-700 text-white font-bold text-base sm:text-lg px-7 py-3.5 rounded-md flex items-center justify-center space-x-2 transition shadow-xl cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>Mulai</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="h-6" />
      </div>

      {/* Showcase Feature 1: TV */}
      <section className="py-16 md:py-24 border-b-8 border-zinc-800 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
              Nikmati di TV Anda.
            </h2>
            <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
              Tonton di Smart TV, PlayStation, Xbox, Chromecast, Apple TV, pemutar Blu-ray, dan banyak lagi.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 sm:w-96 aspect-video bg-zinc-900 border-4 border-zinc-700 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden group">
              <Tv className="w-20 h-20 text-[#E50914] group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-3 text-center text-xs text-gray-400 font-semibold tracking-wider">
                Smart TV • Konsol Game • TV Box
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Feature 2: Download Offline */}
      <section className="py-16 md:py-24 border-b-8 border-zinc-800 px-6 md:px-16 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 sm:w-80 p-4 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex items-center space-x-4">
              <div className="w-14 h-20 rounded bg-red-950/80 border border-red-600/50 flex items-center justify-center shrink-0">
                <Film className="w-8 h-8 text-red-500" />
              </div>
              <div className="truncate flex-1">
                <p className="font-bold text-sm text-white truncate">Stranger Things</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Mengunduh konten...</span>
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
              Download acara untuk menontonnya offline.
            </h2>
            <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
              Simpan tontonan favoritmu dengan mudah agar selalu ada yang bisa dinikmati saat dalam perjalanan tanpa internet.
            </p>
          </div>
        </div>
      </section>

      {/* Showcase Feature 3: Watch Everywhere */}
      <section className="py-16 md:py-24 border-b-8 border-zinc-800 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
              Tonton di mana pun.
            </h2>
            <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
              Streaming film dan serial TV tak terbatas di ponsel, tablet, laptop, dan TV Anda tanpa biaya ekstra.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-72 sm:w-96 aspect-video bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center shadow-2xl">
              <MonitorPlay className="w-20 h-20 text-[#E50914]" />
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Feature 4: Kids Profiles */}
      <section className="py-16 md:py-24 border-b-8 border-zinc-800 px-6 md:px-16 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 flex justify-center">
            <div className="w-72 sm:w-80 p-6 bg-gradient-to-tr from-amber-500/20 to-orange-600/20 border border-amber-500/40 rounded-2xl text-center space-y-3 shadow-2xl">
              <Users className="w-16 h-16 text-amber-400 mx-auto" />
              <h4 className="font-extrabold text-base text-amber-300">Profil Khusus Anak-anak</h4>
              <p className="text-xs text-gray-300">
                Ruang aman dengan kurasi film animasi dan ramah keluarga.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 space-y-4 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
              Buat profil untuk anak-anak.
            </h2>
            <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
              Kirim anak-anak ke petualangan seru bersama karakter favorit mereka di ruang yang dirancang khusus untuk mereka secara gratis.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 md:py-28 px-6 md:px-16 max-w-4xl mx-auto border-b-8 border-zinc-800">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-12">
          Tanya Jawab Umum (FAQ)
        </h2>

        <div className="space-y-3 mb-14">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={faq.q} className="bg-zinc-800/80 rounded-lg overflow-hidden transition">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 text-left font-semibold text-lg sm:text-xl flex items-center justify-between hover:bg-zinc-700/80 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <X className="w-6 h-6 text-white shrink-0" />
                  ) : (
                    <Plus className="w-6 h-6 text-white shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 sm:p-6 border-t border-zinc-700 text-gray-300 text-sm sm:text-base leading-relaxed bg-zinc-850 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Ulang di Bawah */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <p className="text-sm sm:text-lg text-gray-300">
            Siap menonton? Masukkan email Anda untuk membuat atau memulai keanggotaan.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Alamat email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:flex-1 bg-black/70 border border-gray-500 rounded-md px-4 py-3.5 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-white transition"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#E50914] hover:bg-red-700 text-white font-bold text-base px-7 py-3.5 rounded-md flex items-center justify-center space-x-2 transition shadow-xl cursor-pointer active:scale-95"
            >
              <span>Mulai</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer Resmi */}
      <footer className="py-16 px-6 md:px-16 max-w-5xl mx-auto text-gray-400 text-xs space-y-6">
        <p className="hover:underline cursor-pointer">Ada pertanyaan? Hubungi 007-803-321-2130</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <span className="hover:underline cursor-pointer">Tanya Jawab</span>
          <span className="hover:underline cursor-pointer">Pusat Bantuan</span>
          <span className="hover:underline cursor-pointer">Akun</span>
          <span className="hover:underline cursor-pointer">Pusat Media</span>
          <span className="hover:underline cursor-pointer">Hubungan Investor</span>
          <span className="hover:underline cursor-pointer">Lowongan Kerja</span>
          <span className="hover:underline cursor-pointer">Tukar Kartu Hadiah</span>
          <span className="hover:underline cursor-pointer">Cara Menonton</span>
          <span className="hover:underline cursor-pointer">Syarat Penggunaan</span>
          <span className="hover:underline cursor-pointer">Privasi</span>
          <span className="hover:underline cursor-pointer">Preferensi Cookie</span>
          <span className="hover:underline cursor-pointer">Informasi Perusahaan</span>
        </div>
        <p className="pt-4 text-gray-500">© 2026 Flixora Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
      </footer>
    </div>
  );
}
