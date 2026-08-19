import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact AD2PRINT",
  description:
    "Contact AD2PRINT in Indirapuram, Ghaziabad. Call +91 97160 82437, WhatsApp, or send name, mobile, email, and message to book a newspaper ad.",
  path: "/contact",
  keywords: ["contact AD2PRINT", "newspaper ad booking desk", "Ghaziabad classified ads"],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      {children}
    </>
  );
}
