import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ad2print.in").replace(
  /\/$/,
  "",
);

export const DEFAULT_DESCRIPTION =
  "Book classified and display ads across 280+ Indian newspapers with AD2PRINT. Free drafting and translation, proof after print. Ghaziabad desk.";

export const DEFAULT_KEYWORDS = [
  "newspaper ads",
  "book classified ads online",
  "newspaper classified ads",
  "matrimonial newspaper ad",
  "name change newspaper notice",
  "property classified ads India",
  "display ads newspapers",
  "public notice newspaper",
  "AD2PRINT",
  "newspaper advertising Ghaziabad",
];

const OG_IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  "/og/ad2print-1200x630.png": { width: 1200, height: 630 },
  "/ads/hero.png": { width: 1254, height: 1254 },
  "/ads/name-change-banner.png": { width: 1600, height: 294 },
  "/logo.png": { width: 473, height: 92 },
};

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
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const ogTitle = title.includes("AD2PRINT") ? title : `${title} · ${SITE.name}`;
  const imagePath = image ?? "/og/ad2print-1200x630.png";
  const imageSize = image ? OG_IMAGE_SIZES[image] : OG_IMAGE_SIZES["/og/ad2print-1200x630.png"];
  const ogImage = {
    url: absoluteUrl(imagePath),
    width: imageSize?.width ?? 1200,
    height: imageSize?.height ?? 630,
    alt: imageAlt ?? `${SITE.name} — book newspaper ads online`,
  };

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "en_IN",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage.url],
    },
  };
}

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  };
}

export function organizationJsonLd() {
  const mapQuery = encodeURIComponent(`${SITE.name}, ${SITE.address}`);
  const serviceUrl = (path: string) => absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE.name,
    alternateName: "AD2PRINT Newspaper Advertising",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
      width: 473,
      height: 92,
    },
    image: [absoluteUrl("/og/ad2print-1200x630.png")],
    telephone: SITE.phone,
    email: SITE.email,
    description: DEFAULT_DESCRIPTION,
    slogan: SITE.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "SRA-93C, Shipra Riviera, Gyan Khand 3, Indirapuram",
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
    hasMap: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    openingHours: "Mo-Su 09:00-21:00",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: SITE.phone,
        email: SITE.email,
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: [`https://wa.me/${SITE.whatsapp}`],
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking",
    knowsLanguage: [
      "English",
      "Hindi",
      "Marathi",
      "Bengali",
      "Gujarati",
      "Tamil",
      "Telugu",
      "Kannada",
      "Malayalam",
      "Odia",
      "Punjabi",
      "Urdu",
    ],
    knowsAbout: [
      "Newspaper classified advertising",
      "Newspaper display advertising",
      "Name change newspaper notices",
      "Matrimonial newspaper ads",
      "Property classified ads",
      "Recruitment newspaper ads",
      "Public and court notices",
      "Tender and auction notices",
      "Statutory notices",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Newspaper advertising services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Newspaper classified ads",
            url: serviceUrl("/newspaper-classified"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Name change newspaper ad",
            url: serviceUrl("/change-my-name"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Matrimonial newspaper ad",
            url: serviceUrl("/matrimonial"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Tender, court and public notice ads",
            url: serviceUrl("/tender-notice"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Newspaper display advertising",
            url: serviceUrl("/categories/statutory"),
          },
        },
      ],
    },
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
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/newspapers?q={search_term_string}`,
      },
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

export function webPageJsonLd({
  path,
  name,
  description,
  image,
}: {
  path: string;
  name: string;
  description: string;
  image?: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#business` },
    ...(image
      ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image) } }
      : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2"],
    },
  };
}

export function howToJsonLd({
  name,
  description,
  url,
  steps,
}: {
  name: string;
  description: string;
  url: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url,
    inLanguage: "en-IN",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
  category = "Newspaper advertising",
  serviceType = "Newspaper classified and display advertising",
  areaServed,
}: {
  name: string;
  description: string;
  path: string;
  category?: string;
  serviceType?: string;
  areaServed?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed:
      areaServed && areaServed.length > 0
        ? areaServed.map((city) => ({ "@type": "City", name: city }))
        : { "@type": "Country", name: "India" },
    serviceType,
    category,
  };
}

/**
 * Price-bearing service catalogue for pages that show fixed-package rates.
 * Keep this aligned with the JSON files in /data so the markup never quotes a
 * price that the page does not display.
 */
export function offerCatalogJsonLd({
  name,
  offers,
}: {
  name: string;
  offers: { name: string; price: number; path: string; description?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name,
    itemListElement: offers.map((offer, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: offer.name,
      price: offer.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(offer.path),
      itemOffered: {
        "@type": "Service",
        name: offer.name,
        description:
          offer.description ?? `${offer.name} newspaper advertisement through AD2PRINT.`,
      },
    })),
  };
}

export function itemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
