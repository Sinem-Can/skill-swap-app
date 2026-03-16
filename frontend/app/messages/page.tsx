"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MessagesPage() {
  const router = useRouter();
  const supabase = createClient();

  // 1. GÜVENLİK İÇİN YENİ STATE (Sayfayı göstermeden önce bekletir)
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [activeChat, setActiveChat] = useState('Mert');
  const [newMessage, setNewMessage] = useState('');
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
    'Mert': [
      { id: 1, text: 'Selam Sinem! Sistem bizi eşleştirdi. Bana Python konusunda yardımcı olabilir misin?', time: '10:30', isMe: false },
      { id: 2, text: 'Merhaba Mert! Tabii ki, veri analizi kısımlarına odaklanabiliriz.', time: '10:35', isMe: true },
    ],
    'Deniz': [
      { id: 1, text: 'Selam, 3\'lü takas çemberindeymişiz!', time: '11:15', isMe: false },
    ],
    'Ece': [
      { id: 1, text: 'Sistem tasarımı notlarını atabilir misin?', time: 'Dün', isMe: false },
    ]
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    const currentChat = activeChat;
    setChatData(prev => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), userMsg],
    }));
    setNewMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bağlantı sorunu yaşandı.');
      }

      const replyText = typeof data.reply === 'string' ? data.reply.trim() : '';
      const replyMsg: ChatMessage = {
        id: Date.now(),
        text: replyText || 'Bağlantı sorunu yaşandı.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setChatData(prev => ({
        ...prev,
        [currentChat]: [...(prev[currentChat] || []), replyMsg],
      }));
    } catch {
      const fallbackMsg: ChatMessage = {
        id: Date.now(),
        text: 'Bağlantı sorunu yaşandı.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setChatData(prev => ({
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

  // 3. EĞER KONTROL BİTMEDİYSE SAYFAYI HİÇ ÇİZME (Beyaz ekran göster)
  if (!isAuthorized) {
    return null; 
  }

  // BURADAN SONRASI NORMAL TASARIM (Sadece yetkisi olanlar görebilir)
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        
        {/* Sol Kenar: Sohbet Listesi */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Mesajlar</h2>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <div onClick={() => setActiveChat('Mert')} className={`p-4 border-b border-gray-100 cursor-pointer flex items-center gap-3 transition-colors ${activeChat === 'Mert' ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'bg-white hover:bg-gray-50'}`}>
              <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">M</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Mert</h3>
                <p className="text-sm text-gray-600 truncate">Hafta sonu Discord'dan başlayalım mı?</p>
              </div>
            </div>

            <div onClick={() => setActiveChat('Deniz')} className={`p-4 border-b border-gray-100 cursor-pointer flex items-center gap-3 transition-colors ${activeChat === 'Deniz' ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'bg-white hover:bg-gray-50'}`}>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">D</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Deniz</h3>
                <p className="text-sm text-gray-900 font-medium truncate">Selam, 3'lü takas çemberindeymişiz!</p>
              </div>
            </div>

            <div onClick={() => setActiveChat('Ece')} className={`p-4 border-b border-gray-100 cursor-pointer flex items-center gap-3 transition-colors ${activeChat === 'Ece' ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'bg-white hover:bg-gray-50'}`}>
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">E</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Ece</h3>
                <p className="text-sm text-gray-900 font-medium truncate">Sistem tasarımı notlarını atabilir misin?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Aktif Sohbet Alanı */}
        <div className="w-2/3 flex flex-col bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-200 font-bold text-indigo-700">
                {activeChat.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-gray-800">{activeChat}</h2>
                <p className="text-xs font-medium text-green-500">Çevrimiçi</p>
              </div>
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
                    <p className="font-bold text-gray-900">{msg.calendarTitle}</p>
                    <p className="mt-1 text-sm text-gray-700">{msg.calendarDetail}</p>
                    <button
                      type="button"
                      className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      Google Meet Linkine Git
                    </button>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl p-4 ${msg.isMe ? 'rounded-tr-none bg-indigo-600 text-white' : 'rounded-tl-none border border-gray-200 bg-white text-gray-800 shadow-sm'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className={`mt-2 block text-[10px] ${msg.isMe ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.time}</span>
                  </div>
                </div>
              )
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl rounded-tl-none border border-gray-200 bg-gray-100 px-4 py-2.5 shadow-sm">
                  <p className="text-xs text-gray-500 animate-pulse">
                    {activeChat} yazıyor<span className="inline-block w-3 text-left">...</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                placeholder={`${activeChat} için mesaj yaz...`}
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700">
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}