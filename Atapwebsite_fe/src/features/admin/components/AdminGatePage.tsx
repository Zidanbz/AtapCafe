"use client";

import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { loginAdmin } from "@/features/admin/api/admin-api";
import { AdminShell } from "@/features/admin/components/AdminShell";

type AdminGatePageProps = {
  onSuccess: () => void;
};

export function AdminGatePage({ onSuccess }: AdminGatePageProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await loginAdmin(username, password);
      onSuccess();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login admin gagal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <section className="grid min-h-[calc(100vh-3rem)] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Image src="/images/logo-black.png" alt="Atap" width={102} height={39} priority className="h-auto w-[138px]" />
          <h1 className="font-display mt-8 text-4xl font-bold leading-tight sm:text-5xl">Area Admin Atap</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#6f6257]">
            Masuk untuk melihat database pesanan, mengatur akses gate, dan memantau aktivitas order cafe.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_14px_35px_rgba(63,50,35,0.12)] sm:p-6 lg:ml-auto lg:w-full lg:max-w-lg">
          <div className="mb-5 flex items-start gap-3 rounded-2xl bg-[#3d2a18] p-4 text-white">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/12 text-[#d1ad6e]">
              <LockKeyhole size={20} />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold">Login Admin</h1>
              <p className="mt-1 text-sm leading-5 text-[#d8caba]">Masukkan akun admin yang terdaftar di database Atap.</p>
            </div>
          </div>
          <label className="block">
            <span className="text-sm font-bold text-[#6f6257]">Username</span>
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              placeholder="admin"
              className="mt-2 h-12 w-full rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-4 text-sm outline-none focus:border-[#3b864b] focus:ring-4 focus:ring-[#3b864b]/15"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-bold text-[#6f6257]">Password</span>
            <input
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              type="password"
              placeholder="Minimal 6 karakter"
              suppressHydrationWarning
              className="mt-2 h-12 w-full rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-4 text-sm outline-none focus:border-[#3b864b] focus:ring-4 focus:ring-[#3b864b]/15"
            />
          </label>
          {error ? <p className="mt-2 text-sm font-medium text-[#e05252]">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#3d2a18] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Memeriksa..." : "Masuk Admin"}
          </button>
          <p className="mt-4 text-center text-xs text-[#8f8376]">Default seed lokal: admin / 123456</p>
        </form>
      </section>
    </AdminShell>
  );
}
