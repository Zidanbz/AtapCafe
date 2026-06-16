"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, QrCode, Send } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { QuantityStepper } from "@/features/ordering/components/QuantityStepper";
import { SuccessState } from "@/features/ordering/components/SuccessState";
import { createOrder } from "@/features/ordering/api/ordering-api";
import { useCart } from "@/features/ordering/hooks/useCart";
import { useTableNumber } from "@/features/ordering/hooks/useTableNumber";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";

export function CheckoutPage() {
  const table = useTableNumber();
  const { clearCart, items, orderNote, subtotal, updateQuantity } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [submittedTotal, setSubmittedTotal] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalQuantity = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  async function handleSubmitOrder() {
    if (!customerName.trim()) {
      setError("Nama pelanggan wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const order = await createOrder({
        tableCode: table,
        customerName: customerName.trim(),
        orderNote,
        items: items.map((item) => ({
          menuItemId: item.product.id,
          quantity: item.quantity,
          note: item.note || undefined,
        })),
      });

      setSubmittedTotal(order.total);
      clearCart();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Pesanan belum bisa dikirim.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedTotal !== null) {
    return (
      <MobileShell className="bg-[#f3f0ea]" flush>
        <header className="sticky top-0 z-20 grid h-[58px] grid-cols-[44px_1fr_44px] items-center border-b border-[#ddd6cb] bg-white px-4">
          <span />
          <h1 className="font-display text-center text-xl font-bold">Payment</h1>
          <span />
        </header>
        <SuccessState table={table} total={submittedTotal} />
      </MobileShell>
    );
  }

  return (
    <MobileShell className="bg-[#f3f0ea]">
      <header className="sticky top-0 z-20 grid h-[58px] grid-cols-[44px_1fr_44px] items-center border-b border-[#ddd6cb] bg-white px-4">
        <Link href={`/cart?table=${encodeURIComponent(table)}`} aria-label="Kembali ke keranjang" className="inline-flex size-10 items-center justify-center rounded-full">
          <ArrowLeft size={21} />
        </Link>
        <h1 className="font-display text-center text-xl font-bold">Checkout</h1>
        <span />
      </header>
      <section className="px-4 py-5">
        <div className="rounded-2xl bg-[#3d2a18] p-5 text-white shadow-[0_14px_30px_rgba(61,42,24,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#cdbda8]">Meja Anda</p>
          <p className="mt-1 text-2xl font-extrabold">{table}</p>
          <p className="mt-4 text-sm text-[#e8dcca]">{totalQuantity} item siap dikirim ke staff Atap.</p>
        </div>
      </section>
      <section className="px-4">
        {items.length > 0 ? (
          <div className="mb-4 space-y-3">
            <label className="block rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
              <span className="text-sm font-bold text-[#6f6257]">
                Nama Pelanggan <span className="text-[#e05252]">*</span>
              </span>
              <input
                value={customerName}
                onChange={(event) => {
                  setCustomerName(event.target.value);
                  setError("");
                }}
                placeholder="Masukkan nama kamu"
                className="mt-2 h-11 w-full rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-3 text-sm outline-none focus:border-[#3b864b] focus:ring-4 focus:ring-[#3b864b]/15"
              />
            </label>
            <div className="grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-2xl border border-[#d8ead8] bg-white p-4 shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#eff8ef] text-[#3b864b]">
                <QrCode size={19} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-[#2d261f]">Pembayaran QRIS</p>
                <p className="mt-0.5 text-xs text-[#7b7066]">Metode pembayaran saat ini hanya QRIS.</p>
              </div>
              <span className="rounded-full bg-[#eff8ef] px-2 py-1 text-xs font-extrabold text-[#2f8b43]">Aktif</span>
            </div>
          </div>
        ) : null}
        <h2 className="font-display mb-3 text-xl">Ringkasan Pesanan</h2>
        {items.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
            <p className="font-display text-xl font-bold">Belum ada pesanan</p>
            <p className="mt-2 text-sm text-[#7b7066]">Keranjang kamu kosong.</p>
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
              <article key={item.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
                <img src={item.product.image} alt={item.product.name} className="size-14 rounded-lg object-cover" />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold">{item.product.name}</h3>
                  <p className="text-sm font-medium text-[#b98945]">{formatRupiah(item.product.price)}</p>
                  {item.note ? <p className="truncate text-xs text-[#7b7066]">{item.note}</p> : null}
                </div>
                <QuantityStepper value={item.quantity} onChange={(value) => updateQuantity(item.id, value)} compact />
              </article>
            ))}
          </div>
        )}
      </section>
      {items.length > 0 ? (
        <section className="px-4 pb-32 pt-4">
          {orderNote ? (
            <div className="mb-3 rounded-2xl bg-white p-4 text-sm shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
              <p className="font-bold text-[#6f6257]">Catatan</p>
              <p className="mt-1 text-[#2d261f]">{orderNote}</p>
            </div>
          ) : null}
          <div className="rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
            <div className="flex justify-between text-sm text-[#71665c]">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-[#71665c]">
              <span>Biaya tambahan</span>
              <span>Rp0</span>
            </div>
            <div className="mt-3 border-t border-[#ddd6cb] pt-3">
              <div className="flex justify-between text-base font-extrabold">
                <span>Total</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
            </div>
          </div>
          {error ? (
            <div className="mt-3 rounded-2xl border border-[#ffb6b3] bg-[#fff8f4] px-4 py-3 text-sm font-bold text-[#e05252]">
              {error}
            </div>
          ) : null}
        </section>
      ) : null}
      {items.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center bg-[#f3f0ea]/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="inline-flex h-12 w-full max-w-[398px] items-center justify-center gap-2 rounded-xl bg-[#3b864b] px-4 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(59,134,75,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send size={18} />
            {isSubmitting ? "Mengirim..." : "Kirim Pesanan"}
          </button>
        </div>
      ) : null}
    </MobileShell>
  );
}
