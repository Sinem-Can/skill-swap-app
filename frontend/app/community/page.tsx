"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LEADERS = [
  { rank: 1, name: "Elif Yılmaz", swaps: 24, points: 312, medal: "🥇" },
  { rank: 2, name: "Can Demir", swaps: 19, points: 268, medal: "🥈" },
  { rank: 3, name: "Zeynep Kaya", swaps: 16, points: 221, medal: "🥉" },
];

const POPULAR_SKILLS = [
  { name: "Python", percent: 92 },
  { name: "Go (Golang)", percent: 78 },
  { name: "Veri Analizi", percent: 71 },
  { name: "React / TypeScript", percent: 65 },
  { name: "Sistem Tasarımı", percent: 58 },
];

const STATS = [
  { label: "Toplam Takas", value: "1.247", icon: "🔄" },
  { label: "Aktif Kullanıcı", value: "3.891", icon: "👥" },
  { label: "Bu Hafta Takas", value: "89", icon: "📈" },
];

export default function CommunityPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      }
    };
    checkSession();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Topluluk & Liderlik Tablosu
          </h1>
          <p className="mt-2 text-gray-600">
            Haftanın en aktif üyeleri, popüler yetenekler ve platform özeti.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sol: Haftanın Liderleri */}
          <section className="lg:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
              <span>🏆</span> Haftanın Liderleri
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {LEADERS.map((leader) => (
                <div
                  key={leader.rank}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 text-3xl">{leader.medal}</div>
                  <h3 className="font-semibold text-gray-900">{leader.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium text-indigo-600">{leader.swaps}</span> takas
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    <span className="font-medium text-emerald-600">{leader.points}</span> puan
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Sağ: Platform İstatistikleri */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
              <span>🌟</span> Platform İstatistikleri
            </h2>
            <div className="space-y-3">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="text-2xl">{stat.icon}</span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* En Çok Aranan Yetenekler (tam genişlik) */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <span>🔥</span> En Çok Aranan Yetenekler
          </h2>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <ul className="space-y-4">
              {POPULAR_SKILLS.map((skill) => (
                <li key={skill.name}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-40 shrink-0 font-medium text-gray-800">
                      {skill.name}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
                          style={{ width: `${skill.percent}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 shrink-0 text-right text-sm font-semibold text-gray-600">
                      %{skill.percent}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
