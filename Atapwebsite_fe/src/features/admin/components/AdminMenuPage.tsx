"use client";

import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createAdminMenuItem,
  deleteAdminMenuItem,
  fetchAdminMenu,
  updateAdminMenuItem,
  uploadAdminMenuImage,
  type MenuItemPayload,
} from "@/features/admin/api/admin-api";
import { AdminShell } from "@/features/admin/components/AdminShell";
import { AdminTopBar } from "@/features/admin/components/AdminTopBar";
import type { AdminMenuCategory, AdminMenuItem } from "@/features/admin/types/admin";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";

const emptyForm: MenuItemPayload = {
  categoryId: "",
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  isAvailable: true,
  isFeatured: false,
};

function formatPriceInput(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function parsePriceInput(value: string) {
  const numericValue = value.replace(/\D/g, "");

  return numericValue ? Number(numericValue) : 0;
}

export function AdminMenuPage() {
  const [categories, setCategories] = useState<AdminMenuCategory[]>([]);
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [form, setForm] = useState<MenuItemPayload>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageInputKey, setImageInputKey] = useState(0);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  useEffect(() => {
    fetchAdminMenu()
      .then((data) => {
        setCategories(data.categories);
        setItems(data.items);
        setForm((current) => ({ ...current, categoryId: data.categories[0]?.id ?? "" }));
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Menu belum bisa dimuat.");
      });
  }, []);

  async function refreshMenuItems() {
    const data = await fetchAdminMenu();

    setCategories(data.categories);
    setItems(data.items);

    return data.items;
  }

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function resetForm() {
    setSelectedItemId(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? "",
    });
    setImageFile(null);
    setImagePreview("");
    setImageInputKey((current) => current + 1);
    setIsDeleteConfirmOpen(false);
    setMessage("");
  }

  function selectItem(item: AdminMenuItem) {
    setSelectedItemId(item.id);
    setForm({
      categoryId: item.categoryId,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
    });
    setImageFile(null);
    setImagePreview(item.imageUrl);
    setImageInputKey((current) => current + 1);
    setIsDeleteConfirmOpen(false);
    setMessage("");
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      setImageInputKey((current) => current + 1);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ukuran gambar maksimal 5 MB.");
      setImageInputKey((current) => current + 1);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const uploadedImage = imageFile ? await uploadAdminMenuImage(imageFile) : null;
      const imageUrl = uploadedImage?.imageUrl ?? form.imageUrl;

      if (!imageUrl) {
        throw new Error("Upload gambar menu terlebih dahulu.");
      }

      const payload = {
        ...form,
        imageUrl,
      };
      const savedItem = selectedItem
        ? await updateAdminMenuItem(selectedItem.id, payload)
        : await createAdminMenuItem(payload);

      setItems((currentItems) => {
        if (selectedItem) {
          return currentItems.map((item) => (item.id === savedItem.id ? savedItem : item));
        }

        return [savedItem, ...currentItems];
      });
      setSelectedItemId(savedItem.id);
      setForm({
        categoryId: savedItem.categoryId,
        name: savedItem.name,
        description: savedItem.description,
        price: savedItem.price,
        imageUrl: savedItem.imageUrl,
        isAvailable: savedItem.isAvailable,
        isFeatured: savedItem.isFeatured,
      });
      setImageFile(null);
      setImagePreview(savedItem.imageUrl);
      setImageInputKey((current) => current + 1);
      setMessage("Menu berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Menu gagal disimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedItem) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await deleteAdminMenuItem(selectedItem.id);
      setItems((currentItems) => currentItems.filter((item) => item.id !== selectedItem.id));
      resetForm();
      setMessage("Menu berhasil dihapus.");
    } catch (error) {
      const deletedItemId = selectedItem.id;

      try {
        const latestItems = await refreshMenuItems();
        const itemStillExists = latestItems.some((item) => item.id === deletedItemId);

        if (!itemStillExists) {
          resetForm();
          setMessage("Menu berhasil dihapus.");
          return;
        }
      } catch {
        setItems((currentItems) => currentItems.filter((item) => item.id !== deletedItemId));
        resetForm();
        setMessage("Menu dihapus dari tampilan. Muat ulang jika masih muncul.");
        return;
      }

      setMessage(error instanceof Error ? error.message : "Menu gagal dihapus.");
    } finally {
      setIsSaving(false);
      setIsDeleteConfirmOpen(false);
    }
  }

  return (
    <AdminShell navigation>
      <AdminTopBar title="Kelola Menu" />
      <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Daftar Menu</h1>
              <p className="mt-1 text-sm text-[#7b7066]">{items.length} menu terdaftar</p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#3d2a18] px-4 text-sm font-extrabold text-white"
            >
              <Plus size={16} />
              Baru
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectItem(item)}
                className={`overflow-hidden rounded-2xl border bg-white text-left shadow-[0_10px_24px_rgba(63,50,35,0.08)] ${
                  selectedItemId === item.id ? "border-[#3b864b]" : "border-[#e7dfd3]"
                }`}
              >
                <img src={item.imageUrl} alt={item.name} className="h-32 w-full object-cover" />
                <span className="block p-4">
                  <span className="block text-sm font-extrabold">{item.name}</span>
                  <span className="mt-1 block text-xs text-[#7b7066]">{item.category.name}</span>
                  <span className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#b98945]">{formatRupiah(item.price)}</span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${item.isAvailable ? "bg-[#eff8ef] text-[#2f8b43]" : "bg-[#ffe8e8] text-[#e05252]"}`}>
                      {item.isAvailable ? "Aktif" : "Nonaktif"}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="h-fit rounded-2xl bg-white p-5 shadow-[0_10px_28px_rgba(63,50,35,0.1)]">
          <h2 className="font-display text-xl font-bold">{selectedItem ? "Edit Menu" : "Menu Baru"}</h2>
          <label className="mt-4 block">
            <span className="text-sm font-bold text-[#6f6257]">Kategori</span>
            <select
              value={form.categoryId}
              onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
              className="mt-2 h-11 w-full rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-3 text-sm outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-bold text-[#6f6257]">Nama</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-2 h-11 w-full rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-3 text-sm outline-none"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-bold text-[#6f6257]">Harga</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatPriceInput(form.price)}
              onChange={(event) => setForm((current) => ({ ...current, price: parsePriceInput(event.target.value) }))}
              className="mt-2 h-11 w-full rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-3 text-sm outline-none"
            />
          </label>
          <div className="mt-4">
            <span className="text-sm font-bold text-[#6f6257]">Gambar Menu</span>
            <label className="mt-2 flex min-h-[156px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#d0c5b8] bg-[#f4f1ec] text-center transition hover:border-[#b98945] hover:bg-[#f8f5ef]">
              {imagePreview ? (
                <img src={imagePreview} alt={form.name || "Preview menu"} className="h-[156px] w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-2 px-4 text-sm font-bold text-[#7b7066]">
                  <ImagePlus size={28} className="text-[#b98945]" />
                  Upload gambar
                </span>
              )}
              <input
                key={imageInputKey}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
            <p className="mt-2 text-xs font-medium text-[#8f8376]">
              {imageFile ? imageFile.name : "JPG, PNG, WEBP, atau GIF maksimal 5 MB."}
            </p>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-bold text-[#6f6257]">Deskripsi</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="mt-2 h-24 w-full resize-none rounded-xl border border-[#dcd3c8] bg-[#f4f1ec] px-3 py-2 text-sm outline-none"
            />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 rounded-xl bg-[#f4f1ec] px-3 py-3 text-sm font-bold text-[#6f6257]">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) => setForm((current) => ({ ...current, isAvailable: event.target.checked }))}
              />
              Aktif
            </label>
            <label className="flex items-center gap-2 rounded-xl bg-[#f4f1ec] px-3 py-3 text-sm font-bold text-[#6f6257]">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))}
              />
              Featured
            </label>
          </div>
          {message ? <p className="mt-3 text-sm font-bold text-[#7b7066]">{message}</p> : null}
          <button
            type="submit"
            disabled={isSaving}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3d2a18] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save size={17} />
            {isSaving ? "Menyimpan..." : "Simpan Menu"}
          </button>
          {selectedItem ? (
            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              disabled={isSaving}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#ffb6b3] bg-[#fff8f4] text-sm font-extrabold text-[#e05252] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Trash2 size={16} />
              Hapus Menu
            </button>
          ) : null}
        </form>
      </section>
      {isDeleteConfirmOpen && selectedItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-6">
          <section className="w-full max-w-[360px] rounded-2xl bg-white p-5 text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            <div className="mx-auto inline-flex size-11 items-center justify-center rounded-xl bg-[#ffe5e5] text-[#e05252]">
              <Trash2 size={20} />
            </div>
            <h2 className="font-display mt-4 text-xl font-bold">Hapus Menu?</h2>
            <p className="mt-2 text-sm leading-6 text-[#7b7066]">
              Menu {selectedItem.name} akan dihapus dari daftar menu Atap.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isSaving}
                className="h-11 rounded-xl border border-[#ded6ca] bg-[#f4f1ec] text-sm font-extrabold text-[#6f6257] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="h-11 rounded-xl bg-[#df4f51] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </AdminShell>
  );
}
