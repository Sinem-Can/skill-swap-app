import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      console.error("API ŞİFRESİ BULUNAMADI!");
      return NextResponse.json({ error: 'API Key eksik' }, { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const suAn = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const prompt = `Sen SkillSwap adında bir yetenek takası platformunda bir kullanıcısın. Karşıdaki kişi sana mesaj atıyor. Kısa, samimi, gerçek bir insan gibi Türkçe cevap ver. Robot olduğunu belli etme. En fazla 2 cümle kur. Gizli Sistem Bilgisi (Bunu sadece sorulursa kullan): Şu anki gerçek zaman ve tarih: ${suAn}. Gelen mesaj: "${message}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ reply: text });
  } catch (error: any) {
    // Hatayı terminale kırmızı kırmızı yazdırıyoruz ki ne olduğunu görelim!
    console.error('🔴 GERÇEK HATA BURADA:', error.message || error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
