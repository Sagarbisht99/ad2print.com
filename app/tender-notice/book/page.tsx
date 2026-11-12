import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TenderNoticeBuilder } from "@/components/tender/TenderNoticeBuilder";
import { getTenderSelection } from "@/lib/tender";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  searchParams: Promise<{ city?: string; papers?: string }>;
};

export const metadata: Metadata = pageMeta({
  title: "Compose Tender / Public Notice Ad",
  description:
    "Write your tender or public notice matter, check the package rate and pay securely online.",
  path: "/tender-notice/book",
  noIndex: true,
});

export default async function TenderNoticeBookPage({ searchParams }: Props) {
  const query = await searchParams;
  const slugs = (query.papers ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const selection = getTenderSelection(slugs, query.city);

  if (!selection) {
    redirect("/tender-notice");
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tender & public notice ads", path: "/tender-notice" },
          { name: "Compose notice", path: "/tender-notice/book" },
        ])}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-charcoal">
            <Link href="/tender-notice" className="font-semibold text-maroon hover:underline">
              ← Back to tender rates
            </Link>
          </p>
          <p className="text-sm text-charcoal">
            Need help? Call{" "}
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
              {SITE.phone}
            </a>
          </p>
        </div>
      </div>

      <noscript>
        <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-maroon sm:px-6">
          Please enable JavaScript to compose and pay for your notice.
        </p>
      </noscript>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <TenderNoticeBuilder
          booking={{
            city: selection.city,
            papers: selection.papers,
            label: selection.label,
            unit: selection.unit,
            size: selection.size,
            rate: selection.rate,
          }}
        />
      </div>
    </>
  );
}
