import { Armchair } from "lucide-react";

type TableCardProps = {
  table: string;
};

export function TableCard({ table }: TableCardProps) {
  return (
    <section className="mt-3 flex items-center justify-between rounded-xl bg-[#3d2a18] px-5 py-4 text-white shadow-[0_14px_24px_rgba(61,42,24,0.18)]">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cdbda8]">Meja Anda</p>
        <p className="mt-1 text-lg font-semibold">{table}</p>
      </div>
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#8f6a33] text-[#f7dfac]">
        <Armchair size={20} />
      </span>
    </section>
  );
}
