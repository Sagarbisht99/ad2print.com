import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Newspapers for Classified Ads",
  description:
    "Browse 280+ national and regional newspapers to book classified and display ads with AD2PRINT. Filter by language, city, and circulation.",
  path: "/newspapers",
  keywords: ["Indian newspapers", "TOI classified ads", "regional newspaper advertising"],
});

export default function NewspapersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Newspapers", path: "/newspapers" },
        ])}
      />
      {children}
    </>
  );
}
