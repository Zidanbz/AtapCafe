import { Clock } from "lucide-react";

export function CafeInfoCard() {
  return (
    <section className="-mt-6 rounded-2xl bg-white px-5 py-4 shadow-[0_12px_30px_rgba(51,39,28,0.12)]">
      <h2 className="font-display text-[21px] leading-tight text-[#2b2017]">Bertemu DiAtap</h2>
      <div className="mt-1 flex items-center gap-2 text-sm font-medium text-[#24964e]">
        <span className="size-2 rounded-full bg-[#24964e]" />
        <span>Open today, 08:00-23:00</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#9a8d80]">
        <Clock size={14} />
        <span>Last order 22:30</span>
      </div>
    </section>
  );
}
