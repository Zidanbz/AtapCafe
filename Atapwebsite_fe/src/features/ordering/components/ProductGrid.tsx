import type { Product } from "@/features/ordering/types/menu";
import { ProductCard } from "@/features/ordering/components/ProductCard";

type ProductGridProps = {
  products: Product[];
  onOpenProduct: (product: Product) => void;
};

export function ProductGrid({ products, onOpenProduct }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8cdbc] bg-white/70 px-5 py-8 text-center text-sm font-medium text-[#7d7064]">
        Menu belum tersedia untuk kategori ini.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
      ))}
    </div>
  );
}
