"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Verilerimizi senin istediğin gibi sadeleştiriyoruz
const AI_SUGGESTION = {
  id: 'ai-1',
  name: 'Dr. Ayşe',
  skill: 'İstatistik & Veri Bilimi',
  matchRate: '%98',
  reason: 'Python ve Veri Analizi konusundaki yeteneklerinle mükemmel uyuşuyor.'
};

const OTHER_MATCHES = [
  { id: 1, name: 'Mehmet Y.', skill: 'Go Backend Tasarımı', matchRate: '%85' },
  { id: 2, name: 'Deniz K.', skill: 'React & UI Design', matchRate: '%82' },
  { id: 3, name: 'Caner Ö.', skill: 'Bulut Bilişim (AWS)', matchRate: '%78' },
];

export default function MatchesPage() {
  const router = useRouter();

  const handleSendMessage = (name: string) => {
    toast.success(`${name} ile sohbet başlatılıyor...`);
    // İsme özel mesaj sayfasına yönlendirme (Ayşe için URL'de Ayşe yazar)
    setTimeout(() => {
      router.push(`/messages?user=${encodeURIComponent(name)}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* --- ÜST KISIM: AI ÖNERİSİ --- */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">
            ✨ Yapay Zeka Senin İçin Seçti
          </h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">{AI_SUGGESTION.name}</h3>
                <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {AI_SUGGESTION.matchRate} UYUM
                </span>
              </div>
              <p className="text-indigo-800 font-medium text-sm">{AI_SUGGESTION.skill}</p>
              <p className="text-gray-500 text-xs mt-2 italic">"{AI_SUGGESTION.reason}"</p>
            </div>
            <button 
              onClick={() => handleSendMessage(AI_SUGGESTION.name)}
              className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              Mesaj Gönder
            </button>
          </div>
        </section>

        {/* --- ALT KISIM: DİĞER EŞLEŞMELER (SADE LİSTE) --- */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Diğer Potansiyel Eşleşmeler
          </h2>
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {OTHER_MATCHES.map((user) => (
              <div key={user.id} className="py-4 flex items-center justify-between hover:bg-gray-50 transition-colors px-2 rounded-lg group">
                <div>
                  <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.skill} • <span className="text-indigo-400 font-medium">{user.matchRate} Uyum</span></p>
                </div>
                <button 
                  onClick={() => handleSendMessage(user.name)}
                  className="text-indigo-600 font-bold text-sm hover:underline"
                >
                  Mesaj Gönder →
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}