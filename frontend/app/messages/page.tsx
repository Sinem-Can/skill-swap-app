"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // 1. GÜVENLİK İÇİN YENİ STATE (Sayfayı göstermeden önce bekletir)
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [activeChat, setActiveChat] = useState("Mert");
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  type ChatMessage = {
    id: number;
    text?: string;
    time?: string;
    isMe?: boolean;
    isSystem?: boolean;
    calendarTitle?: string;
    calendarDetail?: string;
  };

  const [chatData, setChatData] = useState<Record<string, ChatMessage[]>>({
    Mert: [
      {
        id: 1,
        text: "Selam Sinem! Sistem bizi eşleştirdi. Bana Python konusunda yardımcı olabilir misin?",
        time: "10:30",
        isMe: false,
      },
      {
        id: 2,
        text: "Merhaba Mert! Tabii ki, veri analizi kısımlarına odaklanabiliriz.",
        time: "10:35",
        isMe: true,
      },
    ],
    Deniz: [
      {
        id: 1,
        text: "Selam, 3'lü takas çemberindeymişiz!",
        time: "11:15",
        isMe: false,
      },
    ],
    Ece: [
      {
        id: 1,
        text: "Sistem tasarımı notlarını atabilir misin?",
        time: "Dün",
        isMe: false,
      },
    ],
  });

  // 2. KAPI KONTROLÜ (Bilet var mı?) - Supabase ile
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setIsAuthorized(true);
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleScheduleMeeting = () => {
    const systemMsg: ChatMessage = {
      id: Date.now(),
      isSystem: true,
      calendarTitle: "📅 Yeni Görüşme Planlandı",
      calendarDetail: "Tarih: Bu Hafta Sonu, 20:00",
    };
    setChatData((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), systemMsg],
    }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };
    const currentChat = activeChat;
    setChatData((prev) => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), userMsg],
    }));
    setNewMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bağlantı sorunu yaşandı.");
      }

      const replyText = typeof data.reply === "string" ? data.reply.trim() : "";
      const replyMsg: ChatMessage = {
        id: Date.now(),
        text: replyText || "Bağlantı sorunu yaşandı.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false,
      };
      setChatData((prev) => ({
        ...prev,
        [currentChat]: [...(prev[currentChat] || []), replyMsg],
      }));
    } catch {
      const fallbackMsg: ChatMessage = {
        id: Date.now(),
        text: "Bağlantı sorunu yaşandı.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false,
      };
      setChatData((prev) => ({
        ...prev,
        [currentChat]: [...(prev[currentChat] || []), fallbackMsg],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    setIsTyping(false);
  }, [activeChat]);

  const urlUser = searchParams.get("user");
  const displayName =
    urlUser && urlUser.trim().length > 0 ? urlUser : activeChat;

  // 3. EĞER KONTROL BİTMEDİYSE SAYFAYI HİÇ ÇİZME (Beyaz ekran göster)
  if (!isAuthorized) {
    return null;
  }

  // BURADAN SONRASI NORMAL TASARIM (Sadece yetkisi olanlar görebilir)
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="flex h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Sol Kenar: Sohbet Listesi */}
        <div className="flex w-1/3 flex-col border-r border-gray-200 bg-gray-50">
          <div className="border-b border-gray-200 bg-white p-4">
            <h2 className="text-xl font-bold text-gray-800">Mesajlar</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div
              onClick={() => setActiveChat("Mert")}
              className={`flex cursor-pointer items-center justify-between gap-3 border-b border-gray-100 p-4 transition-colors ${
                activeChat === "Mert"
                  ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Mert</h3>
                <p className="text-sm text-gray-600 truncate">
                  Hafta sonu Discord'dan başlayalım mı?
                </p>
              </div>
            </div>

            <div
              onClick={() => setActiveChat("Deniz")}
              className={`flex cursor-pointer items-center justify-between gap-3 border-b border-gray-100 p-4 transition-colors ${
                activeChat === "Deniz"
                  ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Deniz</h3>
                <p className="text-sm font-medium text-gray-900 truncate">
                  Selam, 3'lü takas çemberindeymişiz!
                </p>
              </div>
            </div>

            <div
              onClick={() => setActiveChat("Ece")}
              className={`flex cursor-pointer items-center justify-between gap-3 border-b border-gray-100 p-4 transition-colors ${
                activeChat === "Ece"
                  ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Ece</h3>
                <p className="text-sm font-medium text-gray-900 truncate">
                  Sistem tasarımı notlarını atabilir misin?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Aktif Sohbet Alanı */}
        <div className="flex w-2/3 flex-col bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white p-4">
            <div className="flex flex-col">
              <h2 className="text-sm font-semibold text-gray-500">
                Sohbet Edilen Kişi
              </h2>
              <p className="text-lg font-bold text-gray-800">{displayName}</p>
            </div>
            <button
              type="button"
              onClick={handleScheduleMeeting}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              📅 Görüşme Planla
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">
            {chatData[activeChat]?.map((msg) =>
              msg.isSystem ? (
                <div key={msg.id} className="flex justify-center">
                  <div className="w-full max-w-md rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 shadow-sm">
                    <p className="font-bold text-gray-900">
                      {msg.calendarTitle}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {msg.calendarDetail}
                    </p>
                    <button
                      type="button"
                      className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      Google Meet Linkine Git
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      msg.isMe
                        ? "rounded-tr-none bg-indigo-600 text-white"
                        : "rounded-tl-none border border-gray-200 bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span
                      className={`mt-2 block text-[10px] ${
                        msg.isMe ? "text-indigo-200" : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              )
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl rounded-tl-none border border-gray-200 bg-gray-100 px-4 py-2.5 shadow-sm">
                  <p className="text-xs text-gray-500 animate-pulse">
                    {displayName} yazıyor
                    <span className="inline-block w-3 text-left">...</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder={`${displayName} için mesaj yaz...`}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}