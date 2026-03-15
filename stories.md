# AI-Powered Skill Swap Platform - Product Requirements

## Epic: User Onboarding & AI Skill Profiling

### Story 1: Profil Oluşturma ve Yetenek Analizi
**Goal:** Kullanıcıların platforma kayıt olup, sahip oldukları ve öğrenmek istedikleri yetenekleri sisteme girmelerini sağlamak.

**Acceptance Criteria:**
* Kullanıcı ad, e-posta, "Sahip Olduğum Yetenekler" ve "Öğrenmek İstediğim Yetenekler" alanlarını içeren bir form doldurabilmelidir.
* Form gönderildiğinde, yapay zeka servisi girilen metinleri analiz edip standartlaştırılmış etiketlere (tags) dönüştürmelidir.
* Kayıt başarılı olduğunda profil veritabanına kaydedilmeli ve kullanıcı paneline yönlendirilmelidir.

**Technical Note:** Frontend'de Next.js App Router kullanılacak. Backend'de profili kaydetmek için `backend/internal/controllers/user.go` içinde bir POST endpoint'i oluşturulacak.

---

### Story 2: Yapay Zeka Destekli Eşleştirme Motoru (Match Engine)
**Goal:** Kullanıcıların sahip olduğu ve aradığı yetenekleri analiz ederek en uygun takas partnerlerini bulmak.

**Acceptance Criteria:**
* Sistem, Kullanıcı A'nın "Sahip Olduğum Yetenekler"i ile Kullanıcı B'nin "Öğrenmek İstediğim Yetenekler"ini ve tam tersini karşılıklı olarak eşleştirmelidir.
* Eşleşen profiller için yapay zeka tarafından hesaplanmış bir "Uyum Skoru" (% üzerinden) üretilmelidir.

**Technical Note:** Eşleştirme algoritmasını `backend/internal/services/match.go` içinde kurgula. Kullanıcıları birer düğüm (node), istenen yetenekleri ise yönlü ayrıtlar (directed edges) olarak düşünerek graf tabanlı bir yaklaşım izleyebilirsin. Eşleştirme öncesi yetenek etiketlerinin anlamsal benzerliğini ölçmek için bir LLM entegrasyonu kullan.

---

### Story 3: Eşleşme Onayı ve İlk İletişim
**Goal:** Önerilen eşleşmeleri kullanıcıların onayına sunmak ve karşılıklı onay durumunda iletişimi başlatmak.

**Acceptance Criteria:**
* Kullanıcılar, potansiyel eşleşmelerini uyum skorları ve yapay zekanın oluşturduğu kısa "Neden iyi bir eşleşmesiniz?" özetiyle birlikte görebilmelidir.
* Kullanıcı her eşleşme için "Kabul Et" veya "Reddet" aksiyonu alabilmelidir.
* İki taraf da eşleşmeyi kabul ettiğinde, aralarında temel bir mesajlaşma arayüzü veya iletişim bilgisi paylaşım ekranı açılmalıdır.

**Technical Note:** Veritabanında eşleşme durumlarını (pending, accepted, rejected) tutacak bir "Connections" tablosu/şeması oluştur. Frontend tarafında eşleşme listesini `frontend/app/matches/page.tsx` rotasında tasarla.