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
        // Kayıt İşlemi
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from('profiles').insert([{ id: data.user.id, full_name: name }]);
          alert("Kayıt başarılı! Giriş yapabilirsiniz.");
          setIsRegistering(false); // Kayıt olunca giriş ekranına döndür
        }
      } else {
        // Giriş İşlemi
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Başarılıysa yönlendir
        router.push('/profile');
        router.refresh(); 
      }
    } catch (error: any) {
      alert(error.message || "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isRegistering ? 'Yeni Hesap Oluştur' : 'Hesabınıza Giriş Yapın'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isRegistering ? 'Zaten hesabınız var mı? ' : 'Veya '}
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)} 
            className="font-bold text-indigo-600 hover:text-indigo-500 bg-transparent border-none cursor-pointer"
          >
            {isRegistering ? 'Buradan giriş yapın' : 'yeni bir hesap oluşturun'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                <div className="mt-1">
                  <input type="text" required={isRegistering} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Adresi</label>
              <div className="mt-1">
                <input type="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Şifre</label>
              <div className="mt-1">
                <input type="password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{isRegistering ? 'Hesap Oluşturuluyor...' : 'Giriş Yapılıyor...'}</span>
                  </>
                ) : (
                  isRegistering ? 'Kayıt Ol' : 'Giriş Yap'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}