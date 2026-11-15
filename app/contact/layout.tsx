import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CONTACT_FAQS } from "@/lib/contact-faqs";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, pageMeta, SITE_URL, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact Our Newspaper Ad Desk",
  description:
    "Contact AD2PRINT in Indirapuram, Ghaziabad. Call +91 79829 36243, WhatsApp, or send an enquiry to book a classified or display ad in 280+ Indian newspapers.",
  path: "/contact",
  keywords: [
    "contact AD2PRINT",
    "newspaper ad booking desk",
    "newspaper advertising Ghaziabad",
    "book newspaper ad by phone",
    "newspaper ad enquiry",
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          webPageJsonLd({
            path: "/contact",
            name: "Contact AD2PRINT newspaper ad booking desk",
            description:
              "Call, WhatsApp or email the AD2PRINT desk to book a newspaper classified or display ad.",
          }),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": `${absoluteUrl("/contact")}#contact`,
            url: absoluteUrl("/contact"),
            name: "Contact AD2PRINT",
            mainEntity: { "@id": `${SITE_URL}/#business` },
          },
          faqJsonLd(CONTACT_FAQS),
        ]}
      />
      {children}
    </>
  );
}
