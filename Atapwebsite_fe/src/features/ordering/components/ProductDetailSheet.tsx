"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/features/ordering/types/menu";
import { useCart } from "@/features/ordering/hooks/useCart";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";
import { QuantityStepper } from "@/features/ordering/components/QuantityStepper";

type ProductDetailSheetProps = {
  product: Product | null;
  onClose: () => void;
};

export function ProductDetailSheet({ product, onClose }: ProductDetailSheetProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNote("");
    }
  }, [product]);

  if (!product) {
    return null;
  }

  const total = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-0 sm:px-6 fade-enter" role="dialog" aria-modal="true">
      <button type="button" aria-label="Tutup detail menu" className="absolute inset-0 cursor-default" onClick={onClose} />
      <section className="sheet-enter relative mb-0 w-full max-w-[430px] rounded-t-[26px] bg-white p-4 shadow-[0_-20px_70px_rgba(0,0,0,0.35)] sm:mb-10 sm:rounded-[26px]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#ddd7ce]" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-[#2b251f] shadow"
        >
          <X size={18} />
        </button>
        <img src={product.image} alt={product.name} className="h-[180px] w-full rounded-2xl object-cover" />
        <div className="pt-4">
          <h2 className="font-display text-2xl font-bold leading-tight text-[#211b16]">{product.name}</h2>
          <p className="mt-1 text-sm font-bold text-[#b98945]">{formatRupiah(product.price)}</p>
          <p className="mt-3 text-sm leading-6 text-[#71665c]">{product.description}</p>
        </div>
        <label className="mt-4 block">
          <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8f8376]">Catatan</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Contoh: less sugar, no ice..."
            className="mt-2 h-[62px] w-full resize-none rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-3 py-3 text-sm text-[#2d261f] outline-none transition placeholder:text-[#8f877e] focus:border-[#b98945] focus:ring-4 focus:ring-[#b98945]/15"
          />
        </label>
        <div className="-mx-4 mt-4 border-t border-[#ebe5dc] px-4 pt-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-[#82776b]">Total Order</p>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>
          <button
            type="button"
            onClick={() => {
              addItem(product, quantity, note);
              onClose();
            }}
            className="flex h-12 w-full items-center justify-between rounded-xl bg-[#3b864b] px-4 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(59,134,75,0.24)] transition active:scale-[0.99]"
          >
            <span>Add Orderan</span>
            <span>- {formatRupiah(total)}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
