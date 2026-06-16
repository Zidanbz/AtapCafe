import { Suspense } from "react";
import { MenuPage } from "@/features/ordering";

export default function MenuRoute() {
  return (
    <Suspense>
      <MenuPage />
    </Suspense>
  );
}
