"use client";

import { CartProvider } from "@/features/ordering/hooks/useCart";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <CartProvider>{children}</CartProvider>;
}
