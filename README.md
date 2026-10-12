# 🎬 Flixora - Platform Streaming Film & Serial TV Modern

Flixora adalah aplikasi web streaming film dan serial TV kelas produksi yang terinspirasi dari antarmuka modern Netflix, dibangun dengan arsitektur **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS**.

---

## ✨ Fitur Utama

- 🌟 **Landing Page Otentik**: Halaman penyambutan publik lengkap dengan headline pendaftaran email, showcase multi-perangkat (TV, Ponsel, PC), dan FAQ akordion interaktif.
- 🔐 **Autentikasi Penuh & Multi-Profil**:
  - Halaman Login & Registrasi sinematik dengan toggle intip kata sandi.
  - Akses cepat 1-klik Akun Demo VIP.
  - Sistem ganti profil pengguna (*Profile Switcher*) dengan dukungan **Kids Mode**.
- 🎬 **Hover-to-Play Video Preview**:
  - Arahkan kursor ke kartu film untuk otomatis memutar cuplikan video sinematik (*auto-play muted loop*).
- 🍿 **Advanced Cinema WatchPlayer**:
  - Pemutar video layar penuh dengan seekbar interaktif.
  - Tombol **Lewati Intro** (*Skip Intro*) dinamis.
  - **Subtitle Nyata & Dinamis di Layar** (Bahasa Indonesia & English).
  - Pilihan Audio Track & Kecepatan Putar (0.5x hingga 2x).
  - Drawer navigasi episode serial TV langsung di dalam player.
- 📺 **Sistem Episode & Musim (Serial TV)**:
  - Tab navigasi musim dan daftar episode dengan thumbnail cuplikan, durasi, dan sinopsis per episode.
- ⏯️ **Lanjutkan Menonton (*Continue Watching*)**:
  - Menyimpan posisi detik terakhir tontonan secara persisten per profil dengan bilah progres merah.
- 💎 **Ekosistem Langganan VIP**:
  - Komparasi 3 tier paket (Ponsel, Standar, Premium VIP) dan simulasi checkout pembayaran (QRIS, GoPay, Kartu Kredit).
- 💬 **Ulasan & Rating Penonton**:
  - Formulir rating 1-5 bintang dan ulasan komunitas yang tersimpan persisten.
- 🎲 **Fitur Putar Acak (*Surprise Me*)** & Pencarian Real-Time.

---

## 🚀 Memulai Proyek

Jalankan server pengembangan lokal:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 16 (Turbopack) & React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Video Engine**: HTML5 Custom Media Stream Engine

---

© 2026 Flixora. Dibuat untuk tujuan demonstrasi dan pembelajaran.
