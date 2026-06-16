"use client";

import { ArrowLeft } from "lucide-react";

type AdminTopBarProps = {
  title: string;
  backHref?: string;
};

export function AdminTopBar({ title, backHref = "/admin" }: AdminTopBarProps) {
  function handleBack() {
    window.location.replace(backHref);
  }

  return (
    <header className="mb-5 flex items-center gap-3 rounded-2xl border border-[#e4ddd2] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(63,50,35,0.06)]">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Kembali ke Dashboard Admin"
        className="inline-flex size-10 items-center justify-center rounded-full bg-[#f4f1ec]"
      >
        <ArrowLeft size={21} />
      </button>
      <h1 className="font-display text-xl font-bold sm:text-2xl">{title}</h1>
    </header>
  );
}
