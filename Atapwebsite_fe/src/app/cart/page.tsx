import { Suspense } from "react";
import { CartPage } from "@/features/ordering";

export default function CartRoute() {
  return (
    <Suspense>
      <CartPage />
    </Suspense>
  );
}
