"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";

type SuccessStateProps = {
  table: string;
  total: number;
};

export function SuccessState({ table, total }: SuccessStateProps) {
  return (
    <section className="flex min-h-[calc(100vh-58px)] flex-col items-center px-5 py-8 text-center sm:min-h-[749px]">
      <div className="mt-5 inline-flex size-[72px] items-center justify-center rounded-full bg-[#3b864b] text-white">
        <Check size={42} strokeWidth={3} />
      </div>
      <h1 className="font-display mt-5 text-2xl font-bold">Pesanan berhasil dikirim</h1>
      <p className="mt-2 max-w-[270px] text-sm leading-6 text-[#756a5f]">Silakan tunggu, pesanan sedang diproses oleh staff Atap.</p>
      <div className="mt-6 w-full rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(63,50,35,0.1)]">
        <p className="font-display text-lg">Total Pesanan</p>
        <p className="mt-28 text-2xl font-extrabold text-[#3b864b]">{formatRupiah(total)}</p>
        <p className="mt-2 text-xs leading-5 text-[#7b7066]">Konfirmasi pesanan akan diproses dari meja kamu.</p>
      </div>
      <div className="mt-4 w-full rounded-2xl bg-white p-4 text-sm shadow-[0_12px_30px_rgba(63,50,35,0.1)]">
        <div className="flex justify-between">
          <span className="text-[#756a5f]">Nomor Meja</span>
          <span className="font-extrabold">{table}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-[#756a5f]">Status</span>
          <span className="font-extrabold">Diproses</span>
        </div>
      </div>
      <Link
        href={`/menu?table=${encodeURIComponent(table)}`}
        className="mt-6 inline-flex h-12 min-w-[220px] items-center justify-center rounded-xl bg-[#3b864b] px-5 text-sm font-extrabold text-white"
      >
        Kembali ke Beranda
      </Link>
    </section>
  );
}
