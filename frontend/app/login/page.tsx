"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        // --- GERÇEK KAYIT İŞLEMİ ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }, // İsmi Supabase'e gönderiyoruz
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        // Profiles tablosuna da ismi kaydedelim
        if (data.user) {
          await supabase.from('profiles').insert([{ id: data.user.id, full_name: name }]);
          alert("Kayıt başarılı! Lütfen e-postanı kontrol et ve doğrula.");
        }
      } else {
        // --- GERÇEK GİRİŞ İŞLEMİ ---
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      // Başarılıysa yönlendir
      router.push('/profile');
      router.refresh(); // Sayfayı yenileyerek auth durumunu güncelle
    } catch (error: any) {
      alert(error.message || "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... Geri kalan tasarım kodun aynı kalabilir (Return içindeki kısım) ...
    // Sadece butonun isLoading durumunu yukarıdaki yeni logic ile kullanacak
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* ... (Senin mevcut return kodun buraya gelecek) ... */}
    </div>
  );
}