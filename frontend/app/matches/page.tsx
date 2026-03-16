"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ÖRNEK VERİLER (Buradaki butonlar artık canlı!)
const MATCHES = [
  { id: 1, name: 'Dr. Ayşe', skill: 'İstatistik & Veri Bilimi', image: 'https://i.pravatar.cc/150?u=ayse' },
  { id: 2, name: 'Mehmet Y.', skill: 'Go Backend Tasarımı', image: 'https://i.pravatar.cc/150?u=mehmet' }
];

export default function MatchesPage() {
  const router = useRouter();

  const handleSendMessage = (name: string) => {
    toast.success(`${name} ile sohbet başlatılıyor...`);
    // 1 saniye sonra mesajlar sayfasına uçuruyoruz
    setTimeout(() => {
      router.push('/messages');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Eşleşmelerin & Öneriler</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {MATCHES.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full border-2 border-indigo-100" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.skill}</p>
              </div>
              <button 
                onClick={() => handleSendMessage(user.name)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
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