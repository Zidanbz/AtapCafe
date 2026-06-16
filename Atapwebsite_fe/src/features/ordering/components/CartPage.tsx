"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { useCart } from "@/features/ordering/hooks/useCart";
import { useTableNumber } from "@/features/ordering/hooks/useTableNumber";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";
import { QuantityStepper } from "@/features/ordering/components/QuantityStepper";

export function CartPage() {
  const table = useTableNumber();
  const { items, orderNote, removeItem, setOrderNote, subtotal, updateQuantity } = useCart();
  const relatedProducts = items.map((item) => item.product).slice(0, 3);

  return (
    <MobileShell className="bg-[#f3f0ea]">
      <header className="sticky top-0 z-20 grid h-[58px] grid-cols-[44px_1fr_44px] items-center border-b border-[#ddd6cb] bg-white px-4">
        <Link href={`/menu?table=${encodeURIComponent(table)}`} aria-label="Kembali ke menu" className="inline-flex size-10 items-center justify-center rounded-full">
          <ArrowLeft size={21} />
        </Link>
        <h1 className="font-display text-center text-xl font-bold">Order</h1>
        <span />
      </header>
      <section className="px-4 py-4">
        {relatedProducts.length > 0 ? (
          <>
            <h2 className="font-display mb-3 text-lg">Menu di Keranjang</h2>
            <div className="atap-scrollbar flex gap-3 overflow-x-auto pb-1">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/menu?table=${encodeURIComponent(table)}`}
                  className="w-[88px] shrink-0 overflow-hidden rounded-xl border border-[#e3dbd0] bg-white text-center shadow-sm"
                >
                  <img src={product.image} alt={product.name} className="h-[86px] w-full object-cover" />
                  <p className="truncate px-2 py-2 text-xs font-bold">{product.name}</p>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </section>
      <section className="border-t border-[#ddd6cb] px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg">Ordered Items ({items.length})</h2>
          <Link
            href={`/menu?table=${encodeURIComponent(table)}`}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#b98945] px-3 text-sm font-bold text-[#b98945]"
          >
            + Add Item
          </Link>
        </div>
        {items.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
            <p className="font-display text-xl font-bold">Keranjang kosong</p>
            <p className="mt-2 text-sm text-[#7b7066]">Pilih menu dulu, nanti pesanan kamu muncul di sini.</p>
            <Link
              href={`/menu?table=${encodeURIComponent(table)}`}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#3b864b] px-4 text-sm font-bold text-white"
            >
              Pilih Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_10px_24px_rgba(63,50,35,0.09)]">
                <img src={item.product.image} alt={item.product.name} className="size-14 rounded-lg object-cover" />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold">{item.product.name}</h3>
                  <p className="text-sm font-medium text-[#b98945]">{formatRupiah(item.product.price)}</p>
                  {item.note ? <p className="truncate text-xs text-[#7b7066]">{item.note}</p> : null}
                </div>
                <div className="flex items-center gap-1">
                  <QuantityStepper value={item.quantity} onChange={(value) => updateQuantity(item.id, value)} compact />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Hapus ${item.product.name}`}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-[#9a4437]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {items.length > 0 ? (
        <section className="px-4 pb-32">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#6f6257]">Catatan Pesanan</span>
            <textarea
              value={orderNote}
              onChange={(event) => setOrderNote(event.target.value)}
              placeholder="Contoh: antar bersamaan, alat makan dua..."
              className="h-20 w-full resize-none rounded-2xl border border-[#ddd4c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#b98945] focus:ring-4 focus:ring-[#b98945]/15"
            />
          </label>
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(63,50,35,0.09)]">
            <h2 className="font-display mb-3 text-lg">Payment Details</h2>
            <div className="space-y-2 text-sm text-[#71665c]">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
              <div className="flex justify-between"><span>Additional Cost</span><span>Rp0</span></div>
              <div className="border-t border-[#ddd6cb] pt-2 font-extrabold text-[#211b16]">
                <div className="flex justify-between"><span>Total</span><span>{formatRupiah(subtotal)}</span></div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {items.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center bg-[#f3f0ea]/95 px-4 py-3 backdrop-blur">
          <div className="grid w-full max-w-[398px] grid-cols-[1fr_1.35fr] items-center gap-3">
            <div>
              <p className="text-sm text-[#7b7066]">Total Payment</p>
              <p className="font-display text-2xl font-bold">{formatRupiah(subtotal)}</p>
            </div>
            <Link
              href={`/checkout?table=${encodeURIComponent(table)}`}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#3b864b] px-4 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(59,134,75,0.24)]"
            >
              Continue to payment
            </Link>
          </div>
        </div>
      ) : null}
    </MobileShell>
  );
}
