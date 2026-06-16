"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/ordering/hooks/useCart";

type CartButtonProps = {
  table: string;
  label?: string;
};

export function CartButton({ table, label = "Keranjang" }: CartButtonProps) {
  const { itemCount } = useCart();

  return (
    <Link
      href={`/cart?table=${encodeURIComponent(table)}`}
      className="relative inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-bold text-[#776a5e]"
      aria-label={`Buka keranjang, ${itemCount} item`}
    >
      <span className="relative inline-flex size-9 items-center justify-center">
        <ShoppingCart size={22} />
        {itemCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-[#c7a56b] text-[11px] font-bold text-white">
            {itemCount}
          </span>
        ) : null}
      </span>
      <span>{label}</span>
    </Link>
  );
}
