import { Suspense } from "react";
import { CheckoutPage } from "@/features/ordering";

export default function CheckoutRoute() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
