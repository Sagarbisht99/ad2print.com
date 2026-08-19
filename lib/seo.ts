import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ad2print.in").replace(
  /\/$/,
  "",
);

export const DEFAULT_DESCRIPTION =
  "Book classified and display ads across 280+ Indian newspapers with AD2PRINT. Clear rates, free drafting and translation, proof before print. Ghaziabad desk.";

export const DEFAULT_KEYWORDS = [
  "newspaper ads",
  "book classified ads online",
  "matrimonial newspaper ad",
  "name change newspaper notice",
  "property classified ads India",
  "display ads newspapers",
  "AD2PRINT",
  "newspaper advertising Ghaziabad",
];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta({
  title,
  description,
  path,
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes("AD2PRINT") ? title : undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle ?? `${title} · ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: absoluteUrl("/logo.png"),
          width: 1024,
          height: 869,
          alt: `${SITE.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: fullTitle ?? `${title} · ${SITE.name}`,
      description,
    },
  };
}

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE.name,
    url: SITE_URL,
    image: absoluteUrl("/logo.png"),
    telephone: SITE.phone,
    email: SITE.email,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: "382-B, Nyay Khand 1, Indirapuram",
      addressLocality: "Ghaziabad",
      addressRegion: "Uttar Pradesh",
      postalCode: "201014",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.6416,
      longitude: 77.3708,
    },
    openingHours: "Mo-Su 09:00-21:00",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    priceRange: "₹₹",
    sameAs: [`https://wa.me/${SITE.whatsapp}`],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#business` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/newspapers?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
