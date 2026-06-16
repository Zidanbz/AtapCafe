"use client";

import Link from "next/link";
import Image from "next/image";
import { CartButton } from "@/features/ordering/components/CartButton";

type MenuHeaderProps = {
  table: string;
};

export function MenuHeader({ table }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#e8e1d7] bg-white px-5">
      <Link href="/" className="inline-flex items-center" aria-label="Atap home">
        <Image src="/images/logo-black.png" alt="Atap" width={102} height={39} priority className="h-auto w-[102px]" />
      </Link>
      <nav className="flex items-center gap-2">
        <Link href={`/menu?table=${encodeURIComponent(table)}`} className="text-sm font-bold text-[#b98945]">
          Home
        </Link>
        <CartButton table={table} />
      </nav>
    </header>
  );
}
