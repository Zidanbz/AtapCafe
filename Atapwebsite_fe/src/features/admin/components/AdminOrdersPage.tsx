"use client";

import Link from "next/link";
import { CalendarDays, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deleteAdminOrder, fetchAdminOrders, updateOrderStatus } from "@/features/admin/api/admin-api";
import { AdminShell } from "@/features/admin/components/AdminShell";
import { AdminTopBar } from "@/features/admin/components/AdminTopBar";
import type { AdminOrder, OrderStatus, PaymentMethod, RawPaymentStatus } from "@/features/admin/types/admin";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";

const statusStyles: Record<OrderStatus, string> = {
  Selesai: "bg-[#eff8ef] text-[#2f8b43]",
  "Di Proses": "bg-[#fff4df] text-[#b98945]",
  "Belum bayar": "bg-[#ffe8e8] text-[#e05252]",
  Batal: "bg-[#ece7df] text-[#7b7066]",
};

const methodStyles: Record<PaymentMethod, string> = {
  QRIS: "bg-[#eff8ef] text-[#2f8b43]",
  Tunai: "bg-[#fff4df] text-[#b98945]",
};

const paymentStatusLabels: Record<RawPaymentStatus, string> = {
  UNPAID: "Belum bayar",
  PENDING: "Menunggu",
  PAID: "Lunas",
  FAILED: "Gagal",
};

function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold ${className}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function StatusSelect({ order, onChange }: { order: AdminOrder; onChange: (order: AdminOrder, status: AdminOrder["rawStatus"]) => void }) {
  return (
    <select
      value={order.rawStatus}
      onChange={(event) => onChange(order, event.target.value as AdminOrder["rawStatus"])}
      className="h-9 rounded-lg border border-[#ddd4c8] bg-white px-2 text-xs font-bold outline-none focus:border-[#b98945] focus:ring-4 focus:ring-[#b98945]/15"
    >
      <option value="PENDING">Pending</option>
      <option value="IN_PROCESS">Di Proses</option>
      <option value="COMPLETED">Selesai</option>
      <option value="CANCELLED">Batal</option>
    </select>
  );
}

function PaymentStatusSelect({
  order,
  onChange,
}: {
  order: AdminOrder;
  onChange: (order: AdminOrder, paymentStatus: RawPaymentStatus) => void;
}) {
  return (
    <select
      value={order.rawPaymentStatus}
      onChange={(event) => onChange(order, event.target.value as RawPaymentStatus)}
      className="mt-2 h-9 rounded-lg border border-[#ddd4c8] bg-white px-2 text-xs font-bold outline-none focus:border-[#b98945] focus:ring-4 focus:ring-[#b98945]/15"
    >
      <option value="UNPAID">Belum bayar</option>
      <option value="PENDING">Menunggu</option>
      <option value="PAID">Lunas</option>
      <option value="FAILED">Gagal</option>
    </select>
  );
}

type OrderActions = {
  onDelete: (order: AdminOrder) => void;
  onPaymentStatusChange: (order: AdminOrder, paymentStatus: RawPaymentStatus) => void;
  onStatusChange: (order: AdminOrder, status: AdminOrder["rawStatus"]) => void;
};

function OrderRow({ order, onDelete, onPaymentStatusChange, onStatusChange }: { order: AdminOrder } & OrderActions) {
  return (
    <tr className="border-b border-[#e6ded3] align-top last:border-b-0 hover:bg-[#fbf8f2]">
      <td className="px-4 py-4 text-sm text-[#7b7066]">{order.id}</td>
      <td className="px-4 py-4">
        <p className="font-extrabold">{order.customerName}</p>
        <p className="mt-1 text-xs leading-5 text-[#7b7066]">{order.contact}</p>
      </td>
      <td className="px-4 py-4 text-sm font-bold">{order.table}</td>
      <td className="px-4 py-4 text-sm">{order.orderType}</td>
      <td className="px-4 py-4 text-sm leading-6">{order.items.join(", ")}</td>
      <td className="px-4 py-4 text-sm font-extrabold">{formatRupiah(order.total)}</td>
      <td className="px-4 py-4">
        <Badge className={methodStyles[order.method]}>{order.method}</Badge>
        <p className="mt-2 text-xs font-bold text-[#7b7066]">{paymentStatusLabels[order.rawPaymentStatus]}</p>
        <PaymentStatusSelect order={order} onChange={onPaymentStatusChange} />
      </td>
      <td className="px-4 py-4 text-sm leading-5 text-[#7b7066]">{order.time}</td>
      <td className="px-4 py-4">
        <Badge className={statusStyles[order.status]}>{order.status}</Badge>
        <div className="mt-2">
          <StatusSelect order={order} onChange={onStatusChange} />
        </div>
      </td>
      <td className="px-4 py-4">
        <button
          type="button"
          onClick={() => onDelete(order)}
          aria-label={`Hapus pesanan ${order.id}`}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-[#ffb6b3] bg-[#fff8f4] text-[#e05252]"
        >
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  );
}

function OrderCard({ order, onDelete, onPaymentStatusChange, onStatusChange }: { order: AdminOrder } & OrderActions) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(63,50,35,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#8d8175]">#{order.id} · {order.table}</p>
          <h3 className="mt-1 text-base font-extrabold">{order.customerName}</h3>
          <p className="mt-1 text-xs leading-5 text-[#7b7066]">{order.contact}</p>
        </div>
        <div className="text-right">
          <Badge className={statusStyles[order.status]}>{order.status}</Badge>
          <div className="mt-2">
            <StatusSelect order={order} onChange={onStatusChange} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-[#7b7066]">Item</span>
          <span className="max-w-[210px] text-right font-semibold">{order.items.join(", ")}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#7b7066]">Tipe</span>
          <span className="font-semibold">{order.orderType}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#7b7066]">Metode</span>
          <span className="text-right">
            <Badge className={methodStyles[order.method]}>{order.method}</Badge>
            <span className="mt-1 block text-xs font-bold text-[#7b7066]">{paymentStatusLabels[order.rawPaymentStatus]}</span>
            <PaymentStatusSelect order={order} onChange={onPaymentStatusChange} />
          </span>
        </div>
        <div className="flex justify-between gap-4 border-t border-[#e6ded3] pt-3">
          <span className="text-[#7b7066]">{order.time}</span>
          <span className="font-extrabold">{formatRupiah(order.total)}</span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(order)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#ffb6b3] bg-[#fff8f4] text-sm font-extrabold text-[#e05252]"
        >
          <Trash2 size={15} />
          Hapus Pesanan
        </button>
      </div>
    </article>
  );
}

function FilterModal({
  dateFrom,
  dateTo,
  onApply,
  onClose,
}: {
  dateFrom: string;
  dateTo: string;
  onApply: (filters: { dateFrom: string; dateTo: string }) => void;
  onClose: () => void;
}) {
  const [draftDateFrom, setDraftDateFrom] = useState(dateFrom);
  const [draftDateTo, setDraftDateTo] = useState(dateTo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-6 fade-enter">
      <button type="button" aria-label="Tutup filter" className="absolute inset-0" onClick={onClose} />
      <section className="relative w-full max-w-[320px] overflow-hidden rounded-[16px] bg-white text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <div className="bg-[#3d2a18] px-5 py-4">
          <h2 className="font-display text-3xl font-bold text-white">Filter</h2>
        </div>
        <div className="space-y-5 px-8 py-8">
          <label className="flex items-center gap-3 text-left">
            <CalendarDays size={36} className="text-[#815a2e]" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-[#7b7066]">Dari tanggal</span>
              <input
                type="date"
                value={draftDateFrom}
                onChange={(event) => setDraftDateFrom(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#ddd4c8] px-3 text-sm font-bold text-[#b98945] outline-none"
              />
            </span>
          </label>
          <label className="flex items-center gap-3 text-left">
            <CalendarDays size={36} className="text-[#815a2e]" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-[#7b7066]">Ke tanggal</span>
              <input
                type="date"
                value={draftDateTo}
                onChange={(event) => setDraftDateTo(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#ddd4c8] px-3 text-sm font-bold text-[#b98945] outline-none"
              />
            </span>
          </label>
          <button
            type="button"
            onClick={() => onApply({ dateFrom: draftDateFrom, dateTo: draftDateTo })}
            className="h-11 rounded-2xl bg-[#3d2a18] px-7 text-base font-extrabold text-white"
          >
            Proses
          </button>
        </div>
      </section>
    </div>
  );
}

function DeleteModal({
  isDeleting,
  order,
  onCancel,
  onConfirm,
}: {
  isDeleting: boolean;
  order: AdminOrder;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-7 fade-enter">
      <section className="sheet-enter w-full max-w-[356px] rounded-[20px] bg-white p-5 text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <h2 className="font-display text-xl font-bold">Hapus Pesanan?</h2>
        <p className="mt-2 text-sm text-[#7b7066]">Pesanan {order.id} akan dihapus dari database.</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={onCancel} className="h-11 rounded-xl border border-[#ded6ca] bg-[#f4f1ec] text-sm font-extrabold">
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-11 rounded-xl bg-[#df4f51] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </section>
    </div>
  );
}

export function AdminOrdersPage() {
  const todayInputValue = getTodayInputValue();
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState(todayInputValue);
  const [dateTo, setDateTo] = useState(todayInputValue);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pagination, setPagination] = useState({ page: 1, take: 10, total: 0, totalPages: 1 });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminOrder | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    fetchAdminOrders({ dateFrom, dateTo, page: pagination.page, take: pagination.take })
      .then((data) => {
        if (isMounted) {
          setOrders(data.orders);
          setPagination(data.pagination);
          setError("");
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Data order belum bisa dimuat.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dateFrom, dateTo, pagination.page, pagination.take]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return orders;
    }

    return orders.filter((order) =>
      [order.customerName, order.table, order.method, order.status].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [orders, query]);

  const activeDateLabel = dateFrom === dateTo
    ? formatDateLabel(dateFrom)
    : `${formatDateLabel(dateFrom)} - ${formatDateLabel(dateTo)}`;

  async function handleStatusChange(order: AdminOrder, status: AdminOrder["rawStatus"]) {
    try {
      const updatedOrder = await updateOrderStatus(order.orderId, { status });
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) => (currentOrder.orderId === order.orderId ? updatedOrder : currentOrder)),
      );
      setError("");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Status order gagal diperbarui.");
    }
  }

  async function handlePaymentStatusChange(order: AdminOrder, paymentStatus: RawPaymentStatus) {
    try {
      const updatedOrder = await updateOrderStatus(order.orderId, { paymentStatus });
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) => (currentOrder.orderId === order.orderId ? updatedOrder : currentOrder)),
      );
      setError("");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Status pembayaran gagal diperbarui.");
    }
  }

  async function handleDeleteOrder() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await deleteAdminOrder(deleteTarget.orderId);
      setOrders((currentOrders) => currentOrders.filter((order) => order.orderId !== deleteTarget.orderId));
      setDeleteTarget(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Pesanan gagal dihapus.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminShell navigation>
      <AdminTopBar title="Database Pesanan" />
      <section className="rounded-3xl bg-[#3d2a18] px-5 py-6 text-white shadow-[0_24px_70px_rgba(61,42,24,0.2)] sm:px-7 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-[#c8bba8]">Selamat datang,</p>
            <h1 className="font-display mt-1 text-3xl font-bold leading-tight sm:text-4xl">Database Pesanan</h1>
            <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#d1ad6e]">Administrator</p>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#d8caba]">Pantau transaksi, metode pembayaran, dan status order yang masuk dari customer Atap.</p>
        </div>
      </section>
      <section className="py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Daftar Order</h2>
            <p className="mt-1 text-sm text-[#7b7066]">
              {pagination.total} pesanan ditemukan untuk {activeDateLabel || "semua tanggal"}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button type="button" onClick={() => setIsFilterOpen(true)} className="h-10 w-full rounded-xl bg-white px-5 text-sm font-bold text-[#6f6257] shadow-sm sm:w-auto">
              Filter Tanggal
            </button>
            {dateFrom !== todayInputValue || dateTo !== todayInputValue ? (
              <button
                type="button"
                onClick={() => {
                  setDateFrom(todayInputValue);
                  setDateTo(todayInputValue);
                  setPagination((current) => ({ ...current, page: 1 }));
                }}
                className="h-10 w-full rounded-xl border border-[#ddd4c8] bg-white px-5 text-sm font-bold text-[#7b7066] sm:w-auto"
              >
                Hari Ini
              </button>
            ) : null}
            <label className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b7066]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama / meja..."
                className="h-10 w-full rounded-xl border border-[#ddd4c8] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#b98945] focus:ring-4 focus:ring-[#b98945]/15"
              />
            </label>
          </div>
        </div>
        {isLoading ? (
          <div className="rounded-2xl bg-white px-5 py-8 text-center text-sm font-bold text-[#7b7066] shadow-sm">
            Memuat pesanan...
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-2xl border border-[#ffb6b3] bg-[#fff8f4] px-5 py-4 text-sm font-bold text-[#e05252]">
            {error.includes("authentication") ? (
              <>
                Sesi admin tidak valid.{" "}
                <Link href="/admin" className="underline">
                  Login ulang
                </Link>
              </>
            ) : (
              error
            )}
          </div>
        ) : null}
        <div className="space-y-3 md:hidden">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onDelete={setDeleteTarget}
              onPaymentStatusChange={handlePaymentStatusChange}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
        <div className="hidden overflow-hidden rounded-2xl bg-white shadow-[0_10px_26px_rgba(63,50,35,0.1)] md:block">
          <div className="atap-scrollbar overflow-x-auto">
            <table className="min-w-[1112px] border-collapse">
              <thead>
                <tr className="bg-[#f8f5ef] text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#8d8175]">
                  <th className="w-[64px] px-4 py-4">#</th>
                  <th className="w-[210px] px-4 py-4">Pelanggan</th>
                  <th className="w-[100px] px-4 py-4">Meja</th>
                  <th className="w-[120px] px-4 py-4">Tipe Order</th>
                  <th className="w-[220px] px-4 py-4">Item Pesanan</th>
                  <th className="w-[130px] px-4 py-4">Total</th>
                  <th className="w-[110px] px-4 py-4">Metode</th>
                  <th className="w-[100px] px-4 py-4">Waktu</th>
                  <th className="w-[130px] px-4 py-4">Status</th>
                  <th className="w-[72px] px-4 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.orderId}
                    order={order}
                    onDelete={setDeleteTarget}
                    onPaymentStatusChange={handlePaymentStatusChange}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-[#8f8376]">
          Halaman {pagination.page} dari {pagination.totalPages} · menampilkan {filteredOrders.length} pesanan
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPagination((current) => ({ ...current, page: Math.max(current.page - 1, 1) }))}
            disabled={pagination.page <= 1}
            className="h-9 rounded-lg bg-white px-4 text-xs font-bold text-[#7b7066] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => setPagination((current) => ({ ...current, page: Math.min(current.page + 1, current.totalPages) }))}
            disabled={pagination.page >= pagination.totalPages}
            className="h-9 rounded-lg bg-white px-4 text-xs font-bold text-[#7b7066] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Berikutnya
          </button>
        </div>
      </section>
      {isFilterOpen ? (
        <FilterModal
          dateFrom={dateFrom}
          dateTo={dateTo}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setDateFrom(filters.dateFrom);
            setDateTo(filters.dateTo);
            setPagination((current) => ({ ...current, page: 1 }));
            setIsFilterOpen(false);
          }}
        />
      ) : null}
      {deleteTarget ? (
        <DeleteModal
          isDeleting={isDeleting}
          order={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteOrder}
        />
      ) : null}
    </AdminShell>
  );
}
