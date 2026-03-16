"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type MatchItem = {
  id: number;
  name: string;
  matchScore: number;
  type: string;
  description: string;
  skills: string[];
  levelMatch: string;
  color: "indigo" | "emerald" | "fuchsia";
};

const MATCHES: MatchItem[] = [
  {
    id: 1,
    name: "Mert & Deniz (3'lü Döngü)",
    matchScore: 94,
    type: "Zincirleme Eşleşme 🔄",
    description:
      "Sen Mert'e Python öğreteceksin, Mert Deniz'e React öğretecek, Deniz sana Go öğretecek.",
    skills: ["Python", "React", "Go"],
    levelMatch: "Kusursuz (Advanced ↔ Beginner)",
    color: "indigo",
  },
  {
    id: 2,
    name: "Ayşe Yılmaz",
    matchScore: 85,
    type: "Doğrudan Eşleşme 🤝",
    description:
      "Karşılıklı takas: Ayşe sana İngilizce Speaking pratiği yaptıracak, sen ona Veri Analizi temellerini göstereceksin.",
    skills: ["İngilizce", "Veri Analizi"],
    levelMatch: "İyi (Intermediate ↔ Beginner)",
    color: "emerald",
  },
];

export default function MatchesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const handleSendMessage = (name: string) => {
    toast.success(`${name} ile sohbet başlatılıyor...`);
    const encoded = encodeURIComponent(name);
    router.push(`/messages?user=${encoded}`);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMatches = normalizedQuery
    ? MATCHES.filter(
        (m) =>
          m.name.toLowerCase().includes(normalizedQuery) ||
          m.skills.some((s) => s.toLowerCase().includes(normalizedQuery))
      )
    : MATCHES;

  useEffect(() => {
    if (highlightedId === null) return;
    const timeout = setTimeout(() => {
      setHighlightedId(null);
    }, 1600);
    return () => clearTimeout(timeout);
  }, [highlightedId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Üst Başlık */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Sizin İçin Bulunan Eşleşmeler
          </h1>
          <p className="text-sm text-gray-600">
            Graf algoritmamız yetenek seviyelerini ve taleplerini analiz ederek
            en uygun takas çemberlerini oluşturdu.
          </p>
        </header>

        {/* Arama Çubuğu */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Yetenek veya eşleşme adıyla ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* AI Banner */}
        <section className="rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-violet-100 to-fuchsia-50 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <span className="text-2xl">✨</span>
              <p className="text-sm leading-relaxed text-gray-800">
                <span className="font-semibold text-fuchsia-800">
                  💡 AI Asistan Önerisi:
                </span>{" "}
                Profilinizdeki Python yetkinliğinize dayanarak, Veri Bilimi ve
                Makine Öğrenmesi (ML) alanlarında takas yapabileceğiniz %98
                uyumlu yeni bir kullanıcı ağımıza katıldı!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById("match-2");
                if (target) {
                  target.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
                setHighlightedId(2);
              }}
              className="shrink-0 rounded-lg bg-fuchsia-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-fuchsia-700"
            >
              Hemen İncele
            </button>
          </div>
        </section>

        {/* Kartlar */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <article
              key={match.id}
              id={`match-${match.id}`}
              className={`flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center ${
                highlightedId === match.id
                  ? "ring-2 ring-fuchsia-400 ring-offset-2 ring-offset-fuchsia-50"
                  : ""
              }`}
            >
              {/* Sol: Uyum Skoru */}
              <div className="flex min-w-[120px] flex-col items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 border-4 border-indigo-100">
                  <span className="text-2xl font-extrabold text-indigo-600">
                    %{match.matchScore}
                  </span>
                </div>
                <span className="mt-2 text-xs font-semibold text-gray-600">
                  Uyum Skoru
                </span>
              </div>

              {/* Orta: Detaylar */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-gray-900">
                    {match.name}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      match.color === "indigo"
                        ? "bg-indigo-50 text-indigo-700"
                        : match.color === "emerald"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-fuchsia-50 text-fuchsia-700"
                    }`}
                  >
                    {match.type}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {match.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] font-medium text-gray-500">
                  🎯 Seviye Uyumu:{" "}
                  <span className="text-gray-700">{match.levelMatch}</span>
                </p>
              </div>

              {/* Sağ: Aksiyonlar */}
              <div className="flex min-w-[140px] flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleSendMessage(match.name)}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  Mesaj Gönder
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Pas Geç
                </button>
              </div>
            </article>
          ))}
        </div>
        {/* Kartlar */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <article
              key={match.id}
              id={`match-${match.id}`}
              className={`flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center ${
                highlightedId === match.id
                  ? "ring-2 ring-fuchsia-400 ring-offset-2 ring-offset-fuchsia-50"
                  : ""
              }`}
            >
              {/* Sol: Uyum Skoru */}
              <div className="flex min-w-[120px] flex-col items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 border-4 border-indigo-100">
                  <span className="text-2xl font-extrabold text-indigo-600">
                    %{match.matchScore}
                  </span>
                </div>
                <span className="mt-2 text-xs font-semibold text-gray-600">
                  Uyum Skoru
                </span>
              </div>

              {/* Orta: Detaylar */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-gray-900">
                    {match.name}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      match.color === "indigo"
                        ? "bg-indigo-50 text-indigo-700"
                        : match.color === "emerald"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-fuchsia-50 text-fuchsia-700"
                    }`}
                  >
                    {match.type}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {match.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] font-medium text-gray-500">
                  🎯 Seviye Uyumu:{" "}
                  <span className="text-gray-700">{match.levelMatch}</span>
                </p>
              </div>

              {/* Sağ: Aksiyonlar */}
              <div className="flex min-w-[140px] flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleSendMessage(match.name)}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  Mesaj Gönder
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Pas Geç
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}