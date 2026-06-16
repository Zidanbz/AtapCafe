"use client";

import Link from "next/link";
import { ChevronRight, Database, LockKeyhole, LogOut, Soup, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/features/admin/api/admin-api";
import { AdminShell } from "@/features/admin/components/AdminShell";
import { adminUsers } from "@/features/admin/data/admin";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";

type AdminDashboardProps = {
  onLogout: () => void;
};

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState([
    { label: "Total Pesanan", value: "-" },
    { label: "Total Revenue", value: "-" },
    { label: "Menu Aktif", value: "-" },
  ]);

  useEffect(() => {
    fetchAdminStats()
      .then((data) => {
        setStats([
          { label: "Total Pesanan", value: String(data.totalOrders) },
          { label: "Total Revenue", value: formatRupiah(data.totalRevenue) },
          { label: "Menu Aktif", value: String(data.activeMenuItems) },
        ]);
      })
      .catch(() => {
        setStats([
          { label: "Total Pesanan", value: "-" },
          { label: "Total Revenue", value: "-" },
          { label: "Menu Aktif", value: "-" },
        ]);
      });
  }, []);

  return (
    <AdminShell navigation>
      <section className="rounded-3xl bg-[#3d2a18] px-5 py-6 text-white shadow-[0_24px_70px_rgba(61,42,24,0.2)] sm:px-7 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-[#c8bba8]">Selamat datang,</p>
            <h1 className="font-display mt-1 text-3xl font-bold leading-tight sm:text-4xl">Admin</h1>
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#d1ad6e]">Administrator</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-right text-sm text-[#d8caba] sm:block">Panel operasional<br />Atap Cafe</span>
            <span className="inline-flex size-12 items-center justify-center rounded-xl border border-[#8b765b] bg-white/5 text-[#d1ad6e]">
              <UserRound size={25} />
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/13 px-4 py-5">
              <p className="font-display text-3xl font-bold leading-none">{stat.value}</p>
              <p className="mt-2 text-sm text-[#d8caba]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h2 className="font-display mb-3 text-2xl font-bold">Pengaturan</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/orders" className="grid min-h-[132px] grid-cols-[48px_1fr_24px] items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_28px_rgba(63,50,35,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(63,50,35,0.14)]">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[#eff8ef] text-[#3b864b]">
                <Database size={22} />
              </span>
              <span>
                <span className="block text-base font-extrabold">Database Pesanan</span>
                <span className="mt-1 block text-sm leading-6 text-[#7b7066]">Lihat, cari, filter, dan kelola semua riwayat order cafe.</span>
              </span>
              <ChevronRight size={21} />
            </Link>
            <Link href="/admin/menu" className="grid min-h-[132px] grid-cols-[48px_1fr_24px] items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_28px_rgba(63,50,35,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(63,50,35,0.14)]">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[#eff8ef] text-[#3b864b]">
                <Soup size={22} />
              </span>
              <span>
                <span className="block text-base font-extrabold">Kelola Menu</span>
                <span className="mt-1 block text-sm leading-6 text-[#7b7066]">Tambah, edit, aktifkan, dan hapus menu cafe.</span>
              </span>
              <ChevronRight size={21} />
            </Link>
            <Link href="/admin/password-gate" className="grid min-h-[132px] grid-cols-[48px_1fr_24px] items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_28px_rgba(63,50,35,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(63,50,35,0.14)]">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[#fff4df] text-[#b98945]">
                <LockKeyhole size={22} />
              </span>
              <span>
                <span className="block text-base font-extrabold">Ubah Password Admin</span>
                <span className="mt-1 block text-sm leading-6 text-[#7b7066]">Atur keamanan akses admin untuk staff Atap.</span>
              </span>
              <ChevronRight size={21} />
            </Link>
          </div>
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Daftar Admin</h2>
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#d4b16e] px-2 text-xs font-bold text-white">
              {adminUsers.length}
            </span>
          </div>
          <div className="space-y-3">
            {adminUsers.map((admin) => (
              <article key={admin.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
                <div className="flex items-center gap-3">
                  <span className="font-display inline-flex size-11 items-center justify-center rounded-xl bg-[#3d2a18] text-lg font-bold text-[#d1ad6e]">
                    {admin.initial}
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold">{admin.name}</span>
                    <span className="block text-xs text-[#7b7066]">{admin.username} · {admin.role}</span>
                  </span>
                </div>
                {admin.removable ? (
                  <button type="button" className="h-9 rounded-lg border border-[#ffb6b3] px-4 text-xs font-bold text-[#e05252]">
                    Hapus
                  </button>
                ) : null}
              </article>
            ))}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#ffb6b3] bg-[#fff8f4] text-sm font-extrabold text-[#e05252]"
          >
            <LogOut size={17} />
            Logout
          </button>
        </section>
      </div>
    </AdminShell>
  );
}
