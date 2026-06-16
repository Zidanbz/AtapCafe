"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CafeInfoCard } from "@/features/ordering/components/CafeInfoCard";
import { CategorySelect } from "@/features/ordering/components/CategorySelect";
import { MenuHeader } from "@/features/ordering/components/MenuHeader";
import { MenuHero } from "@/features/ordering/components/MenuHero";
import { ProductDetailSheet } from "@/features/ordering/components/ProductDetailSheet";
import { ProductGrid } from "@/features/ordering/components/ProductGrid";
import { TableCard } from "@/features/ordering/components/TableCard";
import { fetchMenuData } from "@/features/ordering/api/ordering-api";
import { useCart } from "@/features/ordering/hooks/useCart";
import { useTableNumber } from "@/features/ordering/hooks/useTableNumber";
import type { Category, Product } from "@/features/ordering/types/menu";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";
import Link from "next/link";
import { MobileShell } from "@/components/layout/MobileShell";

export function MenuPage() {
  const table = useTableNumber();
  const { itemCount, subtotal } = useCart();
  const [category, setCategory] = useState<Category>("Semua");
  const [categories, setCategories] = useState<Category[]>(["Semua"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchMenuData()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setCategories(data.categories);
        setProducts(data.products);
        setCategory((currentCategory) =>
          currentCategory && data.categories.includes(currentCategory) ? currentCategory : "Semua",
        );
        setError("");
      })
      .catch((fetchError: unknown) => {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Menu belum bisa dimuat.");
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
  }, []);

  const filteredProducts = useMemo(() => {
    if (category === "Semua") {
      return products;
    }

    return products.filter((product) => product.category === category);
  }, [category, products]);

  const displayedProducts = filteredProducts.length > 0 || category === "Semua" ? filteredProducts : products;
  const activeCategory = filteredProducts.length > 0 || category === "Semua" ? category : "Semua";

  const lovedProducts = displayedProducts.filter((product) => product.featured).slice(0, 4);
  const allProducts =
    activeCategory === "Semua"
      ? displayedProducts.filter((product) => !product.featured)
      : displayedProducts.filter((product) => !lovedProducts.some((lovedProduct) => lovedProduct.id === product.id));

  return (
    <MobileShell>
      <MenuHeader table={table} />
      <MenuHero />
      <div className="relative -mt-6 px-4">
        <CafeInfoCard />
        <TableCard table={table} />
        <CategorySelect categories={categories} value={category} onChange={setCategory} />
      </div>
      <div className="px-4 pb-10 pt-6">
        {isLoading ? (
          <div className="rounded-2xl bg-white px-5 py-8 text-center text-sm font-bold text-[#7b7066] shadow-sm">
            Memuat menu...
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-2xl border border-[#ffb6b3] bg-[#fff8f4] px-5 py-4 text-sm font-bold text-[#e05252]">
            {error}
          </div>
        ) : null}
        <section>
          <h2 className="font-display mb-3 text-xl text-[#2b2017]">People love this! <span aria-hidden="true">❤</span></h2>
          <ProductGrid products={lovedProducts.length > 0 ? lovedProducts : displayedProducts.slice(0, 2)} onOpenProduct={setSelectedProduct} />
        </section>
        <section className="mt-7">
          <h2 className="font-display mb-3 text-xl text-[#2b2017]">{activeCategory === "Semua" ? "Semua Menu" : activeCategory}</h2>
          <ProductGrid products={allProducts.length > 0 ? allProducts : displayedProducts} onOpenProduct={setSelectedProduct} />
        </section>
      </div>
      {itemCount > 0 ? (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:bottom-8">
          <Link
            href={`/cart?table=${encodeURIComponent(table)}`}
            className="flex h-14 w-full max-w-[398px] items-center justify-between rounded-2xl bg-[#3b864b] px-4 text-white shadow-[0_18px_40px_rgba(35,72,42,0.32)] transition active:scale-[0.99]"
          >
            <span className="inline-flex items-center gap-2 text-sm font-extrabold">
              <ShoppingBag size={19} />
              {itemCount} item
            </span>
            <span className="text-sm font-extrabold">{formatRupiah(subtotal)}</span>
          </Link>
        </div>
      ) : null}
      <ProductDetailSheet product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </MobileShell>
  );
}
