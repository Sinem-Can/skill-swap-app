"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const value = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(value === "true");
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white">
      {/* Hero (Kahraman) Alanı */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex animate-fade-in-down items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
          SkillSwap Beta Yayında
        </div>

        <h1 className="mb-8 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-7xl">
          Sadece İkili Değil, <br />
          <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            3&apos;lü Yetenek Takası
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-gray-600">
          Geleneksel eşleştirmeleri unutun. Gelişmiş{" "}
          <strong>Yönlü Graf (Directed Graph)</strong> ve DFS algoritmamız
          sayesinde, doğrudan eşleşemediğiniz durumlarda bile 3. bir kişi
          üzerinden hayalinizdeki yeteneğe ulaşın.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!mounted || !isLoggedIn ? (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl"
            >
              <span>Hemen Kayıt Ol</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          ) : (
            <>
              <Link
                href="/profile"
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl"
              >
                <span>Yeteneğini Ekle</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/matches"
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-bold text-gray-900 transition-all hover:border-indigo-200 hover:bg-indigo-50"
              >
                <span>Eşleşmeleri Gör</span>
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  3
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Nasıl Çalışır / Adımlar */}
      <div className="max-w-5xl mx-auto px-4 mt-8 pb-24">
         <div className="grid md:grid-cols-3 gap-8 relative">
            
            {/* Adım 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative z-10 hover:shadow-md transition-shadow">
               <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl mx-auto mb-6 transform -rotate-6">
                 🎯
               </div>
               <h3 className="font-bold text-xl mb-3 text-gray-900">1. Profilini Oluştur</h3>
               <p className="text-gray-500 text-sm leading-relaxed">Python, Go veya İngilizce... Neleri sunabileceğini ve neleri öğrenmek istediğini seviyeleriyle belirle.</p>
            </div>

            {/* Adım 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative z-10 hover:shadow-md transition-shadow">
               <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 text-3xl mx-auto mb-6 transform rotate-3">
                 🔄
               </div>
               <h3 className="font-bold text-xl mb-3 text-gray-900">2. Algoritma Çalışsın</h3>
               <p className="text-gray-500 text-sm leading-relaxed">Sistemimiz arka planda matematiksel graf çemberleri (cycles) arayarak en ideal 3'lü takas zincirini bulsun.</p>
            </div>

            {/* Adım 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative z-10 hover:shadow-md transition-shadow">
               <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 text-3xl mx-auto mb-6 transform -rotate-3">
                 💬
               </div>
               <h3 className="font-bold text-xl mb-3 text-gray-900">3. İletişime Geç</h3>
               <p className="text-gray-500 text-sm leading-relaxed">Eşleştiğin kişilerle uygulama içi mesajlaş, takvimi ayarla ve yetenek takasını başlat.</p>
            </div>
         </div>
      </div>

    </div>
  );
}