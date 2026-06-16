import type { Category } from "@/features/ordering/types/menu";

type CategorySelectProps = {
  categories: Category[];
  value: Category;
  onChange: (category: Category) => void;
};

export function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
  return (
    <label className="mt-3 block">
      <span className="sr-only">Kategori</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Category)}
        className="h-12 w-full appearance-none rounded-xl border border-[#ddd5c9] bg-white px-4 text-sm font-medium text-[#2d261f] shadow-sm outline-none transition focus:border-[#b98945] focus:ring-4 focus:ring-[#b98945]/15"
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, #7b7066 50%), linear-gradient(135deg, #7b7066 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 18px) 20px, calc(100% - 13px) 20px",
          backgroundSize: "5px 5px, 5px 5px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === "Semua" ? "Semua Menu" : category}
          </option>
        ))}
      </select>
    </label>
  );
}
