"use client";

import { usePathname } from "next/navigation";
import { CategoryEnquiryProvider } from "@/components/CategoryEnquiry";
import { CategoryMarquee } from "@/components/CategoryMarquee";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CategoryEnquiryProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <div className="h-12" aria-hidden />
      <CategoryMarquee />
      <FloatingActions />
    </CategoryEnquiryProvider>
  );
}
