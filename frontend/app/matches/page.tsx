"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

type MatchItem = {
  id: number;
  name: string;
  matchScore: number;
  type: string;
  description: string;
  skills: string[];
  levelMatch: string;
  avatar: string;
  color: string;
};

const initialMatches: MatchItem[] = [
  {
    id: 1,
    name: "Mert & Deniz (3'lü Döngü)",
    matchScore: 94,
    type: "Zincirleme Eşleşme 🔄",
    description: "Sen Mert'e Python öğreteceksin, Mert Deniz'e React öğretecek, Deniz sana Go öğretecek.",
    skills: ["Python", "React", "Go"],
    levelMatch: "Kusursuz (Advanced ↔ Beginner)",
    avatar: "M",
    color: "indigo"
  },
  {
    id: 2,
    name: "Ayşe Yılmaz",
    matchScore: 85,
    type: "Doğrudan Eşleşme 🤝",
    description: "Karşılıklı takas: Ayşe sana İngilizce Speaking pratiği yaptıracak, sen ona Veri Analizi temellerini göstereceksin.",
    skills: ["İngilizce", "Veri Analizi"],
    levelMatch: "İyi (Intermediate ↔ Beginner)",
    avatar: "A",
    color: "emerald"
  }
];

export default function MatchesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [allMatches, setAllMatches] = useState<MatchItem[]>(initialMatches);
  const [isAIAccepted, setIsAIAccepted] = useState(false);

  // KORUMA: Giriş yapmayanları /login'e yönlendir (Supabase ile)
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

  const handleAcceptAIRecommendation = () => {
    setAllMatches((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((m) => m.id)) + 1 : 1,
        name: "Dr. Ayşe (AI Eşleşmesi)",
        matchScore: 98,
        type: "AI Önerisi 🤖",
        description: "Veri Bilimi ve Makine Öğrenmesi alanında takas yapabileceğiniz %98 uyumlu eşleşme. Python yetkinliğinize dayanarak önerildi.",
        skills: ["Veri Bilimi", "Makine Öğrenmesi"],
        levelMatch: "Çok Yüksek (Advanced ↔ Advanced)",
        avatar: "A",
        color: "fuchsia"
      }
    ]);
    toast.success("Yapay zeka önerisi kabul edildi! Yeni eşleşmeniz listeye eklendi. 🚀");
    setIsAIAccepted(true);
  };

  const query = searchQuery.trim().toLowerCase();
  const matches = query
    ? allMatches.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.skills.some((s) => s.toLowerCase().includes(query))
      )
    : allMatches;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Sizin İçin Bulunan Eşleşmeler
          </h1>
          <p className="mt-2 text-gray-500">
            Graf algoritmamız yetenek seviyelerini ve taleplerini analiz ederek en
            uygun takas çemberlerini oluşturdu.
          </p>
        </div>

        {/* Akıllı Arama Çubuğu */}
        <div className="relative mb-4">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* AI Yetenek Önerisi Kartı */}
        <div className="mb-6 rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-violet-100 to-fuchsia-50 p-4 shadow-sm">
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
              onClick={handleAcceptAIRecommendation}
              disabled={isAIAccepted}
              className="shrink-0 rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-fuchsia-700 disabled:bg-fuchsia-400 disabled:cursor-default disabled:hover:bg-fuchsia-400"
            >
              {isAIAccepted ? "Eklendi ✓" : "Hemen İncele"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                
                {/* Sol Taraf: Uyum Yüzdesi (Yuvarlak/Büyük) */}
                <div className="flex flex-col items-center justify-center min-w-[120px]">
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-gray-50 border-4 border-indigo-100">
                    <span className="text-2xl font-extrabold text-indigo-600">%{match.matchScore}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600 mt-2">Uyum Skoru</span>
                </div>

                {/* Orta Kısım: Eşleşme Detayları */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{match.name}</h2>
                    <span className={`bg-${match.color}-100 text-${match.color}-700 text-xs px-3 py-1 rounded-full font-bold`}>
                      {match.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{match.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {match.skills.map(skill => (
                      <span key={skill} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">🎯 Seviye Uyumu: <span className="text-gray-700">{match.levelMatch}</span></p>
                </div>

                {/* Sağ Taraf: Aksiyon Butonu */}
                <div className="flex flex-col gap-3 min-w-[150px]">
                  <Link href="/messages" className="bg-indigo-600 text-white text-center px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                    Mesaj Gönder
                  </Link>
                  <button className="bg-white text-gray-500 text-center px-6 py-2 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
                    Pas Geç
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}