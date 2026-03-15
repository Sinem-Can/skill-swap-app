"use client";

import { useState } from "react";

export type SkillFormData = {
  skillName: string;
  category: string;
  direction: "offers" | "wants";
  level: string;
  description: string;
  format: string;
  duration: string;
};

const CATEGORIES = [
  "Programlama",
  "Tasarım",
  "Dil",
  "Müzik & Sanat",
  "İş & Yönetim",
  "Diğer",
];

const LEVELS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const FORMATS = [
  { value: "Online", label: "Online" },
  { value: "In-Person", label: "Yüz Yüze" },
  { value: "Both", label: "Her İkisi" },
];

const initialFormState: SkillFormData = {
  skillName: "",
  category: "",
  direction: "offers",
  level: "",
  description: "",
  format: "",
  duration: "",
};

export default function SkillAddForm() {
  const [form, setForm] = useState<SkillFormData>(initialFormState);

  const handleChange = (
    field: keyof SkillFormData,
    value: string | "offers" | "wants"
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...form,
      directionLabel:
        form.direction === "offers" ? "Bunu Öğretebilirim" : "Bunu Öğrenmek İstiyorum",
    };
    console.log("Yetenek formu verisi (JSON):", JSON.stringify(payload, null, 2));
    setForm(initialFormState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">
          Yeni Yetenek Ekle
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Sunabileceğin veya öğrenmek istediğin yeteneği aşağıya ekle.
        </p>
      </div>

      <div className="space-y-5">
        {/* 1. Skill Adı */}
        <div>
          <label
            htmlFor="skillName"
            className="block text-sm font-medium text-zinc-700"
          >
            Yetenek Adı
          </label>
          <input
            id="skillName"
            type="text"
            required
            value={form.skillName}
            onChange={(e) => handleChange("skillName", e.target.value)}
            placeholder="Örn: React, İngilizce, Piyano"
            className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>

        {/* 2. Kategori */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-zinc-700"
          >
            Kategori
          </label>
          <select
            id="category"
            required
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          >
            <option value="">Kategori seçin</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Yetenek Yönü (Radio) */}
        <div>
          <span className="block text-sm font-medium text-zinc-700">
            Yetenek Yönü
          </span>
          <div className="mt-2 flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="direction"
                value="offers"
                checked={form.direction === "offers"}
                onChange={(e) => handleChange("direction", e.target.value as "offers" | "wants")}
                className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <span className="text-sm text-zinc-700">
                Bunu Öğretebilirim
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="direction"
                value="wants"
                checked={form.direction === "wants"}
                onChange={(e) => handleChange("direction", e.target.value as "offers" | "wants")}
                className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <span className="text-sm text-zinc-700">
                Bunu Öğrenmek İstiyorum
              </span>
            </label>
          </div>
        </div>

        {/* 4. Seviye */}
        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-zinc-700"
          >
            Seviye
          </label>
          <select
            id="level"
            required
            value={form.level}
            onChange={(e) => handleChange("level", e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          >
            <option value="">Seviye seçin</option>
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Açıklama */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700"
          >
            Açıklama
          </label>
          <textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Yetenekle ilgili kısa açıklama (isteğe bağlı)"
            className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>

        {/* 6. Tercih Edilen Format */}
        <div>
          <label
            htmlFor="format"
            className="block text-sm font-medium text-zinc-700"
          >
            Tercih Edilen Format
          </label>
          <select
            id="format"
            required
            value={form.format}
            onChange={(e) => handleChange("format", e.target.value)}
            className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          >
            <option value="">Format seçin</option>
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* 7. Süre */}
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-zinc-700"
          >
            Süre
          </label>
          <input
            id="duration"
            type="text"
            value={form.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="Örn: Haftada 2 saat"
            className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
        >
          Ekle
        </button>
      </div>
    </form>
  );
}
