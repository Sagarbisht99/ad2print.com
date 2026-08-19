"use client";

import Image from "next/image";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#1b1c20] lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-white/20">
            <Image src="/logo.png" alt="AD2PRINT" width={40} height={40} className="h-9 w-9 object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">AD2PRINT</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-maroon-soft">Admin desk</p>
          </div>
        </div>
        <AdminNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#1b1c20] px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
              <Image src="/logo.png" alt="AD2PRINT" width={32} height={32} className="h-7 w-7 object-contain" />
            </div>
            <p className="text-sm font-semibold">Admin desk</p>
          </div>
          <AdminNav compact />
        </header>
        <main className="flex-1 bg-[radial-gradient(ellipse_at_top,rgba(178,31,45,0.12),transparent_45%)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
