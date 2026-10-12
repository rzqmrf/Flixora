"use client";

import React, { useState } from "react";
import { X, Check, Crown, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SubscriptionTier } from "@/types/user";

interface PlanOption {
  id: SubscriptionTier;
  name: string;
  price: string;
  quality: string;
  resolution: string;
  devices: number;
  popular?: boolean;
}

const PLANS: PlanOption[] = [
  {
    id: "Ponsel",
    name: "Paket Ponsel",
    price: "Rp 54.000 / bln",
    quality: "Bagus",
    resolution: "720p (HD)",
    devices: 1,
  },
  {
    id: "Standar",
    name: "Paket Standar",
    price: "Rp 120.000 / bln",
    quality: "Sangat Bagus",
    resolution: "1080p (Full HD)",
    devices: 2,
  },
  {
    id: "Premium VIP",
    name: "Paket Premium VIP",
    price: "Rp 186.000 / bln",
    quality: "Terbaik",
    resolution: "4K (Ultra HD) + HDR",
    devices: 4,
    popular: true,
  },
];

export default function SubscriptionModal() {
  const { user, isSubscriptionModalOpen, setIsSubscriptionModalOpen, upgradeSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>("Premium VIP");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "gopay" | "card">("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isSubscriptionModalOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        upgradeSubscription(selectedPlan);
        setShowSuccess(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative bg-[#181818] text-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/80 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Tombol Tutup */}
        <button
          onClick={() => setIsSubscriptionModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1.5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {showSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Selamat Datang di Flixora VIP!
            </h2>
            <p className="text-sm text-gray-300 max-w-md">
              Pembayaran Anda berhasil diverifikasi. Akun Anda kini aktif dengan paket{" "}
              <span className="text-amber-400 font-bold">{selectedPlan}</span>. Nikmati streaming 4K tanpa batas!
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-amber-600 px-3 py-1 rounded-full text-xs font-bold text-white mb-3 shadow">
                <Crown className="w-3.5 h-3.5" />
                <span>FLIXORA VIP PASS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Pilih Paket Hiburan Terbaik Anda
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Tonton ribuan film bioskop & serial eksklusif tanpa jeda iklan. Batalkan kapan saja.
              </p>
            </div>

            {/* Pilihan Paket Kartu */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-xl p-4 sm:p-5 border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? "bg-gradient-to-b from-zinc-800 to-zinc-900 border-[#E50914] ring-2 ring-[#E50914]/60 shadow-xl scale-102"
                        : "bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E50914] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                        Paling Populer
                      </span>
                    )}

                    <div>
                      <h3 className="font-bold text-sm text-white">{plan.name}</h3>
                      <div className="text-lg font-black text-amber-400 mt-1">{plan.price}</div>
                    </div>

                    <div className="my-4 space-y-2 border-t border-zinc-800 pt-3 text-xs text-gray-300">
                      <div className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span>Kualitas: <b>{plan.quality}</b></span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span>Resolusi: <b>{plan.resolution}</b></span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span>{plan.devices} Perangkat bersamaan</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span>Fitur Download Offline</span>
                      </div>
                    </div>

                    <div
                      className={`w-full py-1.5 rounded-lg text-center text-xs font-bold transition ${
                        isSelected
                          ? "bg-[#E50914] text-white"
                          : "bg-zinc-800 text-gray-400"
                      }`}
                    >
                      {isSelected ? "Paket Terpilih" : "Pilih Paket"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-6">
              <span className="block text-xs font-bold text-gray-300 mb-2.5 uppercase tracking-wider">
                Pilih Metode Pembayaran
              </span>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("qris")}
                  className={`p-2.5 rounded-lg border text-center font-semibold transition cursor-pointer ${
                    paymentMethod === "qris"
                      ? "border-red-500 bg-red-950/30 text-white"
                      : "border-zinc-700 bg-zinc-800/80 text-gray-300 hover:text-white"
                  }`}
                >
                  QRIS (BCA, Mandiri, dll.)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("gopay")}
                  className={`p-2.5 rounded-lg border text-center font-semibold transition cursor-pointer ${
                    paymentMethod === "gopay"
                      ? "border-red-500 bg-red-950/30 text-white"
                      : "border-zinc-700 bg-zinc-800/80 text-gray-300 hover:text-white"
                  }`}
                >
                  GoPay / OVO / DANA
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-2.5 rounded-lg border text-center font-semibold transition cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-red-500 bg-red-950/30 text-white"
                      : "border-zinc-700 bg-zinc-800/80 text-gray-300 hover:text-white"
                  }`}
                >
                  Kartu Kredit / Debit
                </button>
              </div>
            </div>

            {/* Tombol Eksekusi Berlangganan */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                <span>Transaksi Terenkripsi SSL 256-Bit Aman</span>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full sm:w-auto bg-[#E50914] hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses Transaksi...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Aktifkan {selectedPlan} Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
