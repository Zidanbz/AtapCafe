import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  compact?: boolean;
};

export function QuantityStepper({ value, onChange, min = 1, compact = false }: QuantityStepperProps) {
  const buttonSize = compact ? "size-8" : "size-10";

  return (
    <div className="grid grid-cols-[auto_40px_auto] items-center gap-1">
      <button
        type="button"
        aria-label="Kurangi jumlah"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${buttonSize} inline-flex items-center justify-center rounded-lg border border-[#ded6ca] bg-[#f4f1eb] text-[#2d261f] transition active:scale-95`}
      >
        <Minus size={compact ? 14 : 16} strokeWidth={3} />
      </button>
      <span className="text-center text-sm font-bold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Tambah jumlah"
        onClick={() => onChange(value + 1)}
        className={`${buttonSize} inline-flex items-center justify-center rounded-lg border border-[#ded6ca] bg-[#f4f1eb] text-[#2d261f] transition active:scale-95`}
      >
        <Plus size={compact ? 14 : 16} strokeWidth={3} />
      </button>
    </div>
  );
}
