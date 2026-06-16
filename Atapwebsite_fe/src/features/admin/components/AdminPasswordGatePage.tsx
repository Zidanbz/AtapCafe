"use client";

import { Check, Circle, Eye, LockKeyhole, RotateCcw, Save, X } from "lucide-react";
import { useMemo, useState } from "react";
import { changeAdminPassword, isAdminAuthenticated } from "@/features/admin/api/admin-api";
import { AdminShell } from "@/features/admin/components/AdminShell";
import { AdminTopBar } from "@/features/admin/components/AdminTopBar";

export function AdminPasswordGatePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const hasMinLength = newPassword.length >= 6;
  const hasNumber = /\d/.test(newPassword);
  const hasCapital = /[A-Z]/.test(newPassword);
  const passwordMatches = confirmation.length > 0 && confirmation === newPassword;
  const canSubmit = currentPassword.length > 0 && hasMinLength && hasNumber && passwordMatches;
  const [isSaving, setIsSaving] = useState(false);

  const strength = useMemo(() => {
    const score = [hasMinLength, hasNumber, hasCapital].filter(Boolean).length;
    if (score <= 1) {
      return { label: "Lemah", width: "33%", color: "bg-[#e05252]" };
    }
    if (score === 2) {
      return { label: "Sedang", width: "66%", color: "bg-[#d1ad6e]" };
    }
    return { label: "Kuat", width: "100%", color: "bg-[#3b864b]" };
  }, [hasCapital, hasMinLength, hasNumber]);

  async function handleSave() {
    if (!isAdminAuthenticated()) {
      setMessage("Silakan login admin terlebih dahulu.");
      return;
    }

    if (!canSubmit) {
      setMessage("Periksa kembali password yang kamu masukkan.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await changeAdminPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setMessage("Password admin berhasil diperbarui.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Password admin gagal diperbarui.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
    setMessage("Reset password dilakukan lewat seed database atau update password baru setelah login.");
  }

  return (
    <AdminShell navigation>
      <AdminTopBar title="Ubah Password Admin" />
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex items-start gap-3 rounded-2xl bg-[#3d2a18] p-5 text-white shadow-[0_18px_48px_rgba(61,42,24,0.16)] lg:min-h-[260px]">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/12 text-[#d1ad6e]">
            <LockKeyhole size={20} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Password Admin</h1>
            <p className="mt-2 text-sm leading-6 text-[#d8caba]">Password ini diverifikasi oleh backend sebelum staff bisa masuk ke area admin Atap.</p>
          </div>
        </div>
        <div>
        <div className="rounded-2xl bg-white p-5 shadow-[0_10px_28px_rgba(63,50,35,0.1)] sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <LockKeyhole size={16} className="text-[#b98945]" />
            <h2 className="font-display text-lg font-bold">Ganti Password</h2>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-[#6f6257]">Password Saat Ini <span className="text-[#e05252]">*</span></span>
            <div className="mt-2 grid h-11 grid-cols-[1fr_34px] items-center rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-3">
              <input
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                type="password"
                suppressHydrationWarning
                className="min-w-0 bg-transparent text-sm outline-none"
              />
              {currentPassword ? <Check size={16} className="text-[#7b7066]" /> : null}
            </div>
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-[#6f6257]">Password Baru <span className="text-[#e05252]">*</span></span>
            <div className="mt-2 grid h-11 grid-cols-[1fr_34px] items-center rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-3">
              <input
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                type="password"
                placeholder="Minimal 6 karakter"
                suppressHydrationWarning
                className="min-w-0 bg-transparent text-sm outline-none placeholder:text-[#8f877e]"
              />
              <Eye size={16} className="text-[#7b7066]" />
            </div>
          </label>
          <div className="mt-2 h-1 rounded-full bg-[#dfd7cb]">
            <div className={`h-full rounded-full ${strength.color}`} style={{ width: strength.width }} />
          </div>
          <p className="mt-2 text-xs font-bold text-[#b98945]">{strength.label}</p>
          <div className="mt-3 space-y-1.5 text-xs">
            <p className={hasMinLength ? "text-[#3b864b]" : "text-[#8f8376]"}>
              {hasMinLength ? <Check size={14} className="mr-1 inline" /> : <Circle size={14} className="mr-1 inline" />}
              Minimal 6 karakter
            </p>
            <p className={hasNumber ? "text-[#3b864b]" : "text-[#8f8376]"}>
              {hasNumber ? <Check size={14} className="mr-1 inline" /> : <Circle size={14} className="mr-1 inline" />}
              Mengandung angka
            </p>
            <p className={hasCapital ? "text-[#3b864b]" : "text-[#8f8376]"}>
              {hasCapital ? <Check size={14} className="mr-1 inline" /> : <Circle size={14} className="mr-1 inline" />}
              Mengandung huruf kapital
            </p>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-[#6f6257]">Konfirmasi Password Baru <span className="text-[#e05252]">*</span></span>
            <div className={`mt-2 grid h-11 grid-cols-[1fr_34px] items-center rounded-xl border px-3 ${confirmation && !passwordMatches ? "border-[#ff5c5c] bg-white" : "border-[#dcd3c8] bg-[#f4f1ec]"}`}>
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                type="password"
                suppressHydrationWarning
                className="min-w-0 bg-transparent text-sm outline-none"
              />
              {confirmation && !passwordMatches ? <X size={16} className="text-[#ff5c5c]" /> : null}
            </div>
            {confirmation && !passwordMatches ? <span className="mt-1 block text-xs text-[#e05252]">Password tidak cocok</span> : null}
          </label>
          {message ? <p className="mt-3 text-sm font-medium text-[#7b7066]">{message}</p> : null}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3d2a18] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save size={17} />
          {isSaving ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
        <div className="mt-4 grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-2xl border border-[#ffb6b3] bg-[#fff8f4] p-4">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#ffe5e5] text-[#e05252]">
            <RotateCcw size={17} />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[#e05252]">Reset Gate</p>
            <p className="text-xs text-[#e05252]">Hapus password & nonaktifkan</p>
          </div>
          <button type="button" onClick={handleReset} className="h-9 rounded-lg bg-[#e05252] px-4 text-xs font-extrabold text-white">
            Reset
          </button>
        </div>
        </div>
      </section>
    </AdminShell>
  );
}
