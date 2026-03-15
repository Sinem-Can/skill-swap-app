"use client";

// Statik mock veri – gerçek uygulamada API veya auth'dan gelecek
const MOCK_PROFILE = {
  id: "u1",
  name: "Deniz Kaya",
  profilePhoto:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  bio: "Frontend geliştirici ve tasarım meraklısı. React ve TypeScript ile ölçeklenebilir arayüzler kurmayı seviyorum. Yeni yetenekler öğrenmek ve paylaşmak için buradayım.",
  rating: 4.8,
  completedSwaps: 12,
  skillsOffered: [
    { name: "React", level: "Advanced", description: "Hooks, Server Components, state yönetimi" },
    { name: "TypeScript", level: "Advanced", description: "Tip güvenliği ve modern JS" },
    { name: "Tailwind CSS", level: "Intermediate", description: "Utility-first CSS ve responsive tasarım" },
    { name: "UI/UX Temelleri", level: "Intermediate", description: "Erişilebilirlik ve kullanıcı deneyimi" },
  ],
  skillsWanted: [
    { name: "Go", level: "Beginner", description: "Backend ve CLI araçları" },
    { name: "Sistem Tasarımı", level: "Beginner", description: "Ölçeklenebilir mimari" },
    { name: "Veritabanı Optimizasyonu", level: "Intermediate", description: "PostgreSQL, indeksleme" },
  ],
};

function LevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Beginner: "bg-sky-100 text-sky-800",
    Intermediate: "bg-amber-100 text-amber-800",
    Advanced: "bg-emerald-100 text-emerald-800",
  };
  const style = styles[level] ?? "bg-zinc-100 text-zinc-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {level}
    </span>
  );
}

export default function UserProfilePage() {
  const p = MOCK_PROFILE;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Üst kısım: Profil kartı */}
        <header className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
            <div className="shrink-0">
              <img
                src={p.profilePhoto}
                alt={p.name}
                className="h-28 w-28 rounded-full object-cover ring-4 ring-zinc-100 sm:h-32 sm:w-32"
                width={128}
                height={128}
              />
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                {p.name}
              </h1>
              {p.bio && (
                <p className="text-sm leading-relaxed text-zinc-600">
                  {p.bio}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                {/* Yıldız değerlendirmesi */}
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5">
                  <span className="text-amber-600" aria-hidden>
                    ★
                  </span>
                  <span className="text-sm font-semibold text-amber-800">
                    {p.rating.toFixed(1)}
                  </span>
                </div>
                {/* Tamamlanan takas rozeti */}
                <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5">
                  <span className="text-sm font-semibold text-violet-800">
                    {p.completedSwaps} tamamlanan takas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Alt kısım: İki sütunlu grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Sol sütun: Sunabileceği yetenekler */}
          <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                Sunabileceği Yetenekler
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Bu yetenekleri başkalarıyla paylaşmaya hazır
              </p>
            </div>
            <ul className="divide-y divide-zinc-100">
              {p.skillsOffered.map((skill, index) => (
                <li key={index} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-zinc-900">
                      {skill.name}
                    </span>
                    <LevelBadge level={skill.level} />
                  </div>
                  {skill.description && (
                    <p className="mt-1 text-xs text-zinc-500">
                      {skill.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Sağ sütun: Öğrenmek istediği yetenekler */}
          <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                Öğrenmek İstediği Yetenekler
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Geliştirmek istediği alanlar
              </p>
            </div>
            <ul className="divide-y divide-zinc-100">
              {p.skillsWanted.map((skill, index) => (
                <li key={index} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-zinc-900">
                      {skill.name}
                    </span>
                    <LevelBadge level={skill.level} />
                  </div>
                  {skill.description && (
                    <p className="mt-1 text-xs text-zinc-500">
                      {skill.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
