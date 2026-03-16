"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser(user ?? null);
      setMounted(true);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Sol: Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-indigo-600"
            >
              Skill<span className="text-gray-800">Swap</span>
            </Link>
          </div>

          {/* Sağ: Menü */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="font-medium text-gray-600 transition-colors hover:text-indigo-600"
              >
                Ana Sayfa
              </Link>

              {/* Giriş yapmış kullanıcılar için ekstra sekmeler */}
              {mounted && user && (
                <>
                  <Link
                    href="/profile"
                    className="font-medium text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/matches"
                    className="font-medium text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    Eşleşmeler
                  </Link>
                  <Link
                    href="/messages"
                    className="flex shrink-0 items-center gap-2 font-medium text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    Mesajlar
                    <span className="shrink-0 animate-pulse rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      3 Yeni
                    </span>
                  </Link>
                  <Link
                    href="/community"
                    className="font-medium text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    Topluluk
                  </Link>
                </>
              )}
            </div>

            {/* Sağ uç: Login / Logout alanı */}
            {mounted && user ? (
              <>
                <div className="mx-2 h-6 shrink-0 border-l border-gray-200" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <div className="mx-2 h-6 shrink-0 border-l border-gray-200" />
                <Link
                  href="/login"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Giriş Yap
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
