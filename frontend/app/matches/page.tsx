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
const MATCHES: MatchRow[] = [
  {
    id: 1,
    name: "Dr. Ayşe",
    skillSummary: "İstatistik, Veri Bilimi, Deney Tasarımı",
    matchRate: 96,
  },
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
      <div className="mx-auto max-w-3xl space-y-6">
        {/* AI Önerisi Bölümü */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4 shadow-sm">
          <h1 className="text-base font-semibold text-indigo-900">
            Yapay Zeka Senin İçin Harika Bir Eşleşme Buldu!
          </h1>
          <p className="mt-1 text-sm text-indigo-800/80">
            Profilindeki yeteneklere göre, aşağıdaki kişilerle yüksek uyumlu bir
            takas yapma potansiyelin var.
          </p>
        </div>

        {/* Dikey, sade liste */}
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {MATCHES.map((match) => (
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
                    Yetenek Uyumu: %{match.matchRate}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{match.skillSummary}</p>
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
      </div>
    </div>
  );
}