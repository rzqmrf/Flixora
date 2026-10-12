import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { WatchHistoryProvider } from "@/context/WatchHistoryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flixora - Platform Streaming Film & Serial TV Premium",
  description: "Tonton ribuan film bioskop, serial TV eksklusif, dan trailer resmi dengan kualitas 4K Ultra HD di Flixora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#141414] text-white selection:bg-[#E50914]">
        <AuthProvider>
          <WatchlistProvider>
            <WatchHistoryProvider>{children}</WatchHistoryProvider>
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
