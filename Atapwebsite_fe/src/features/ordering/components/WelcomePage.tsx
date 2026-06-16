"use client";

import Link from "next/link";
import Image from "next/image";
import { MobileShell } from "@/components/layout/MobileShell";

export function WelcomePage() {
  return (
    <MobileShell flush className="bg-black">
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 text-center text-white sm:min-h-[807px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(108,79,39,0.58), rgba(34,24,16,0.52)), url(https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=86)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#3d2a18]/20" />
        <div className="relative -mt-10 flex flex-col items-center">
          <Image src="/images/logo-white.png" alt="Atap" width={245} height={94} priority className="h-auto w-[160px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.28)]" />
          <h1 className="font-display mt-5 text-3xl leading-tight">Bertemu di Atap</h1>
        </div>
        <Link
          href="/menu?table=IN-01"
          className="relative mt-9 inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-[#c3a069] px-8 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(0,0,0,0.24)] transition active:scale-[0.98]"
        >
          ORDER SEKARANG
        </Link>
      </section>
    </MobileShell>
  );
}
