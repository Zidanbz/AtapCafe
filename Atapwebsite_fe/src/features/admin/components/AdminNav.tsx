"use client";

import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Home, LockKeyhole, Soup } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/admin/menu", label: "Menu", icon: Soup },
  { href: "/admin/password-gate", label: "Password", icon: LockKeyhole },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#e4ddd2] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(63,50,35,0.06)] lg:flex-row lg:items-center lg:justify-between">
      <Link href="/admin" className="inline-flex w-fit items-center gap-3">
        <Image src="/images/logo-black.png" alt="Atap" width={102} height={39} priority className="h-auto w-[92px]" />
        <span className="hidden h-8 w-px bg-[#e4ddd2] sm:block" />
        <span className="hidden text-sm font-extrabold text-[#6f6257] sm:block">Admin Panel</span>
      </Link>
      <nav className="atap-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0" aria-label="Navigasi admin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-extrabold transition ${
                isActive ? "bg-[#3d2a18] text-white" : "bg-[#f4f1ec] text-[#6f6257] hover:bg-[#ece5da]"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
