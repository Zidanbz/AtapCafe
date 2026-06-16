import type { Product } from "@/features/ordering/types/menu";
import { formatRupiah } from "@/features/ordering/utils/format-rupiah";

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
};

export function ProductCard({ product, onOpen }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e7dfd3] bg-white shadow-[0_10px_24px_rgba(63,50,35,0.1)]">
      <button type="button" onClick={() => onOpen(product)} className="block w-full text-left">
        <div className="aspect-[1/1.08] w-full overflow-hidden bg-[#f1eee8]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="px-3 pb-3 pt-3">
          <h3 className="line-clamp-1 text-sm font-extrabold text-[#1f1a16]">{product.name}</h3>
          <p className="mt-1 text-sm font-medium text-[#b98945]">{formatRupiah(product.price)}</p>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="h-10 w-full border-t border-[#e7dfd3] text-sm font-bold text-[#b98945] transition hover:bg-[#fbf6ee] active:bg-[#f1eadf]"
      >
        + Tambah
      </button>
    </article>
  );
}
