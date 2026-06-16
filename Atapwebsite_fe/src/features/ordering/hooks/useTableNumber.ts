"use client";

import { useSearchParams } from "next/navigation";

const DEFAULT_TABLE = "IN-01";

export function useTableNumber() {
  const searchParams = useSearchParams();
  const table = searchParams.get("table")?.trim();

  return table || DEFAULT_TABLE;
}
