"use client";

import SkillAddForm from "../components/SkillAddForm";

export default function SkillAddPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Yetenek Ekleme Paneli
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Sunabileceğin veya öğrenmek istediğin yetenekleri buradan ekleyebilirsin.
          </p>
        </header>
        <SkillAddForm />
      </div>
    </div>
  );
}
