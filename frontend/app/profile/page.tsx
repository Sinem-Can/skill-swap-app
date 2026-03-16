"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  // KULLANICI BİLGİLERİ İÇİN STATE
  const [displayName, setDisplayName] = useState("Yükleniyor...");
  const [initials, setInitials] = useState("??");

  useEffect(() => {
    const checkUser = async () => {
      // Supabase'den giriş yapmış kullanıcıyı kontrol et
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Eğer kullanıcı yoksa Login'e gönder
        router.push('/login');
      } else {
        // Kullanıcı ismini metadata'dan al
        const fullName = user.user_metadata?.full_name || "Yetenek Takasçısı";
        setDisplayName(fullName);
        
        // İsimden baş harfleri oluştur (Örn: Sinem Can -> SC)
        const nameParts = fullName.split(' ');
        const initials = nameParts.length > 1 
          ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
          : nameParts[0][0].toUpperCase();
        setInitials(initials);
      }
    };
    
    checkUser();
  }, [router, supabase]);

  // ÇIKIŞ YAPMA FONKSİYONU (Supabase ile güncellendi)
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Supabase oturumunu kapat
    router.push('/login');
  };

  // --- MEVCUT YETENEK STATELERİN (Aynı kalabilir) ---
  const [offeredSkills, setOfferedSkills] = useState([
    { id: 1, name: 'Python Programlama', desc: 'Data analiz ve AI projeleri için.', level: 'Advanced' }
  ]);

  const [requiredSkills, setRequiredSkills] = useState<
    { id: number; name: string; desc: string; level: string; progress?: number }[]
  >([
    { id: 1, name: 'Go (Golang)', desc: 'Backend ve sistem tasarımı için.', level: 'Beginner', progress: 45 }
  ]);

  const RADAR_DATA = [
    { subject: "Python", value: 95, fullMark: 100 },
    { subject: "Makine Öğrenmesi", value: 85, fullMark: 100 },
    { subject: "İstatistik", value: 90, fullMark: 100 },
    { subject: "Veri Görselleştirme", value: 80, fullMark: 100 },
    { subject: "React", value: 60, fullMark: 100 },
    { subject: "Go", value: 40, fullMark: 100 },
  ];

  const BADGES = [
    { emoji: '👑', label: 'Süper Öğretici', className: 'bg-amber-100 text-amber-800' },
    { emoji: '🚀', label: 'Seri Takasçı', className: 'bg-purple-100 text-purple-800' },
    { emoji: '🧠', label: 'Veri Bilimi Kurdu', className: 'bg-blue-100 text-blue-800' },
  ];

  const [formData, setFormData] = useState({
    skillName: '',
    category: 'Yazılım & Teknoloji',
    type: 'offers',
    level: 'Beginner'
  });

  const handleDeleteSkill = (id: number, type: "offers" | "requires") => {
    if (type === "offers") {
      setOfferedSkills((prev) => prev.filter((s) => s.id !== id));
    } else {
      setRequiredSkills((prev) => prev.filter((s) => s.id !== id));
    }
    toast.success("Yetenek başarıyla silindi!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSkill = {
      id: Date.now(),
      name: formData.skillName,
      desc: `${formData.category} kategorisinde.`,
      level: formData.level
    };

    if (formData.type === "offers") {
      setOfferedSkills([...offeredSkills, newSkill]);
    } else {
      setRequiredSkills([...requiredSkills, { ...newSkill, progress: 0 }]);
    }
    setFormData({ ...formData, skillName: "" });
    toast.success("Yetenek başarıyla eklendi!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Sayfa içi navigasyon sekmeleri (Profil, Eşleşmeler, Mesajlar, Topluluk) */}
        <nav className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium shadow-sm">
          <Link
            href="/profile"
            className="rounded-full bg-gray-900 px-4 py-1.5 text-white shadow-sm"
          >
            Profil
          </Link>
          <Link
            href="/matches"
            className="rounded-full px-4 py-1.5 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
          >
            Eşleşmeler
          </Link>
          <Link
            href="/messages"
            className="rounded-full px-4 py-1.5 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
          >
            Mesajlar
          </Link>
          <Link
            href="/community"
            className="rounded-full px-4 py-1.5 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
          >
            Topluluk
          </Link>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 relative">
          
          <button 
            onClick={handleLogout}
            className="absolute top-8 right-8 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-lg transition-colors"
          >
            🚪 Çıkış Yap
          </button>

          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
            {/* BAŞ HARFLER DİNAMİK OLDU */}
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 text-3xl font-bold">
              {initials}
            </div>
            <div>
              {/* İSİM DİNAMİK OLDU */}
              <h1 className="text-3xl font-bold text-gray-800">{displayName}</h1>
              <p className="text-gray-500 mt-1">Yetenek Takasçısı | {displayName.split(' ')[0]} Gelişim Yolculuğunda</p>
              
              <div className="flex gap-4 mt-3">
                <span className="flex items-center text-yellow-500 font-medium bg-yellow-50 px-3 py-1 rounded-full text-sm">
                  ⭐ 5.0 Değerlendirme
                </span>
                <span className="flex items-center text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full text-sm">
                  🆕 Yeni Üye
                </span>
              </div>
              
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Kazanılan Rozetler</p>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map((badge) => (
                    <span
                      key={badge.label}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-transform hover:scale-105 ${badge.className}`}
                    >
                      <span>{badge.emoji}</span>
                      <span>{badge.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Radar Grafik ve Diğer Bölümler Aynı Kalabilir */}
          {/* ... (Senin mevcut JSX kodun devam ediyor) ... */}
          
          <div className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">Yetenek & Gelişim Analizi</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#4f46e5", fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#6b7280" }} />
                  <Radar
                    name="Seviye"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">Sunabileceğim Yetenekler</h2>
              <div className="space-y-3">
                {offeredSkills.map((skill) => (
                  <div key={skill.id} className="relative bg-white p-4 rounded-lg shadow-sm border border-indigo-50 transform transition-all hover:-translate-y-1">
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id, 'offers')}
                      className="absolute right-2 top-2 p-1 text-gray-400 transition-colors hover:text-red-500"
                    >
                      <span className="text-lg leading-none">&#10005;</span>
                    </button>
                    <div className="flex justify-between items-start pr-6">
                      <div>
                        <h3 className="font-semibold text-gray-800">{skill.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{skill.desc}</p>
                      </div>
                      <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-medium shrink-0">{skill.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100">
              <h2 className="text-xl font-bold text-emerald-900 mb-4">Öğrenmek İstediklerim</h2>
              <div className="space-y-3">
                {requiredSkills.map((skill) => {
                  const progress = skill.progress ?? 0;
                  return (
                    <div key={skill.id} className="relative bg-white p-4 rounded-lg shadow-sm border border-emerald-50 transform transition-all hover:-translate-y-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill.id, 'requires')}
                        className="absolute right-2 top-2 p-1 text-gray-400 transition-colors hover:text-red-500"
                      >
                        <span className="text-lg leading-none">&#10005;</span>
                      </button>
                      <div className="flex justify-between items-start pr-6">
                        <div>
                          <h3 className="font-semibold text-gray-800">{skill.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{skill.desc}</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded font-medium shrink-0">{skill.level}</span>
                      </div>
                      <div className="mt-3 pr-6">
                        <p className="text-xs font-medium text-gray-500 mb-1">%{progress} Tamamlandı</p>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Yeni Yetenek Ekleme Formu */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Yeni Yetenek Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yetenek Adı</label>
                <input type="text" required placeholder="Örn: React, Piyano, İngilizce" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.skillName} onChange={(e) => setFormData({...formData, skillName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option>Yazılım & Teknoloji</option><option>Yabancı Dil</option><option>Müzik & Sanat</option><option>Spor</option><option>Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amacın Nedir?</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="offers">Bunu Öğretebilirim (Sunuyorum)</option><option value="requires">Bunu Öğrenmek İstiyorum (Arıyorum)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seviye</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg">
                Yetenek Ekle
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}