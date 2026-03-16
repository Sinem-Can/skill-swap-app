"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type MatchRow = {
  id: number;
  name: string;
  skillSummary: string;
  matchRate: number;
};

// Basit, metin odaklı mock veriler
const AI_MATCH: MatchRow = {
  id: 1,
  name: "Dr. Ayşe",
  skillSummary: "İstatistik, Veri Bilimi, Deney Tasarımı",
  matchRate: 98,
};

const OTHER_MATCHES: MatchRow[] = [
  {
    id: 2,
    name: "Mehmet Y.",
    skillSummary: "Go Backend, Mikroservisler, PostgreSQL",
    matchRate: 92,
  },
];

export default function MatchesPage() {
  const router = useRouter();

  const handleSendMessage = (name: string) => {
    toast.success(`${name} ile sohbet başlatılıyor...`);
    const encoded = encodeURIComponent(name);
    router.push(`/messages?user=${encoded}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Üst Bölüm: Yapay Zeka Önerisi */}
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-50 px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Yapay Zeka Önerisi
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-bold text-indigo-900">
                {AI_MATCH.name}
              </h1>
              <p className="text-sm text-indigo-800/90">
                {AI_MATCH.skillSummary}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                %{AI_MATCH.matchRate} Yetenek Uyumu
              </span>
              <button
                type="button"
                onClick={() => handleSendMessage(AI_MATCH.name)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                Mesaj Gönder
              </button>
            </div>
          </div>
        </section>

        {/* Alt Bölüm: Diğer Eşleşmeler */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-800">
            Diğer Eşleşmeler
          </h2>
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
            {OTHER_MATCHES.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between gap-4 px-4 py-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {match.name}
                    </p>
                    <span className="text-xs font-medium text-emerald-600">
                      %{match.matchRate} Uyum
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {match.skillSummary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendMessage(match.name)}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  Mesaj Gönder
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}