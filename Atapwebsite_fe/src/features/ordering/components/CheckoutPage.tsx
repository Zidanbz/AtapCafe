"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Banknote, CreditCard, Send } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { QuantityStepper } from "@/features/ordering/components/QuantityStepper";
import { SuccessState } from "@/features/ordering/components/SuccessState";
import { createOrder } from "@/features/ordering/api/ordering-api";
import { useCart } from "@/features/ordering/hooks/useCart";
import { useTableNumber } from "@/features/ordering/hooks/useTableNumber";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";

type MidtransSnapCallbacks = {
  onSuccess?: (result: unknown) => void;
  onPending?: (result: unknown) => void;
  onError?: (result: unknown) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks?: MidtransSnapCallbacks) => void;
    };
  }
}

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const MIDTRANS_SNAP_URL = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ?? "https://app.sandbox.midtrans.com/snap/snap.js";
type PaymentMethod = "CASH" | "QRIS";

function loadMidtransSnapScript(src: string, clientKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.snap) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Midtrans belum bisa dimuat.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.clientKey = clientKey;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Midtrans belum bisa dimuat."));
    document.body.appendChild(script);
  });
}

function openMidtransPayment(token: string) {
  return new Promise<"success" | "pending">((resolve, reject) => {
    window.snap?.pay(token, {
      onSuccess: () => resolve("success"),
      onPending: () => resolve("pending"),
      onError: () => reject(new Error("Pembayaran gagal diproses.")),
      onClose: () => reject(new Error("Pembayaran belum diselesaikan.")),
    });
  });
}

export function CheckoutPage() {
  const table = useTableNumber();
  const { clearCart, items, orderNote, subtotal, updateQuantity } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [submittedTotal, setSubmittedTotal] = useState<number | null>(null);
  const [submittedPaymentMethod, setSubmittedPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
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
        paymentMethod,
        orderNote,
        items: items.map((item) => ({
          menuItemId: item.product.id,
          quantity: item.quantity,
          note: item.note || undefined,
        })),
      });

      if (order.midtrans?.token) {
        if (!MIDTRANS_CLIENT_KEY) {
          throw new Error("Midtrans client key belum dikonfigurasi.");
        }

        await loadMidtransSnapScript(order.midtrans.snapJsUrl || MIDTRANS_SNAP_URL, MIDTRANS_CLIENT_KEY);
        await openMidtransPayment(order.midtrans.token);
      } else if (order.midtrans?.redirectUrl) {
        window.location.href = order.midtrans.redirectUrl;
        return;
      }

      setSubmittedPaymentMethod(paymentMethod);
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
        <SuccessState table={table} total={submittedTotal} paymentMethod={submittedPaymentMethod} />
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
            <div className="rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
              <p className="text-sm font-bold text-[#6f6257]">Metode Pembayaran</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("CASH");
                    setError("");
                  }}
                  className={`flex min-h-[92px] flex-col items-start rounded-xl border p-3 text-left transition ${
                    paymentMethod === "CASH" ? "border-[#3b864b] bg-[#eff8ef] text-[#2d261f]" : "border-[#e2dbd2] bg-[#f8f5f0] text-[#756a5f]"
                  }`}
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white text-[#3b864b]">
                    <Banknote size={18} />
                  </span>
                  <span className="mt-2 text-sm font-extrabold">Cash</span>
                  <span className="mt-1 text-xs leading-4">Bayar langsung di kasir.</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("QRIS");
                    setError("");
                  }}
                  className={`flex min-h-[92px] flex-col items-start rounded-xl border p-3 text-left transition ${
                    paymentMethod === "QRIS" ? "border-[#3b864b] bg-[#eff8ef] text-[#2d261f]" : "border-[#e2dbd2] bg-[#f8f5f0] text-[#756a5f]"
                  }`}
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white text-[#3b864b]">
                    <CreditCard size={18} />
                  </span>
                  <span className="mt-2 text-sm font-extrabold">Cashless</span>
                  <span className="mt-1 text-xs leading-4">Bayar dengan Midtrans.</span>
                </button>
              </div>
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
            {isSubmitting ? "Memproses..." : paymentMethod === "CASH" ? "Lanjut ke Kasir" : "Bayar Sekarang"}
          </button>
        </div>
      ) : null}
    </MobileShell>
  );
}
