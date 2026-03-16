"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type MatchCard = {
  id: number;
  name: string;
  title: string;
  image: string;
  matchRate: number;
  skills: string[];
  badges: string[];
  description: string;
};

// Zenginleştirilmiş mock veriler
const MATCHES: MatchCard[] = [
  {
    id: 1,
    name: "Dr. Ayşe",
    title: "İstatistik & Veri Bilimi Uzmanı",
    image: "https://i.pravatar.cc/150?u=ayse",
    matchRate: 96,
    skills: ["İstatistik", "R", "Python", "AB Test", "Deney Tasarımı"],
    badges: ["Akademisyen", "Mentor", "Data Science"],
    description:
      "Akademide ve sektörde 8+ yıl deneyimli. Veri odaklı düşünme ve modelleme konusunda güçlü.",
  },
  {
    id: 2,
    name: "Mehmet Y.",
    title: "Go Backend & Sistem Tasarımı",
    image: "https://i.pravatar.cc/150?u=mehmet",
    matchRate: 92,
    skills: ["Go", "PostgreSQL", "Microservices", "Docker"],
    badges: ["Backend", "High Availability"],
    description:
      "Gerçek zamanlı sistemler ve ölçeklenebilir mimarilerde deneyimli. Pair-programming ile öğretmeyi seviyor.",
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Senin İçin Akıllı Eşleşmeler
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Profilindeki yeteneklere göre önerilen, yüksek uyumlu potansiyel eşleşmeler.
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {MATCHES.map((user) => (
            <article
              key={user.id}
              className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Üst satır: Avatar + isim + match rate */}
              <div className="mb-4 flex items-start gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 p-[2px]">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-full w-full rounded-full border-2 border-white object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </h2>
                      <p className="text-sm text-gray-500">{user.title}</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                      Yetenek Uyumu: %{user.matchRate}
                    </div>
                  </div>
                  {/* Rozetler */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {user.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Açıklama */}
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {user.description}
              </p>

              {/* Yetenek etiketleri */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Alt kısım: Aksiyonlar */}
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="text-xs text-gray-400">
                  Öneri tipi:{" "}
                  <span className="font-medium text-gray-500">AI Eşleşmesi</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendMessage(user.name)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                  >
                    Mesaj Gönder
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}