import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { LostFoundBuilder } from "@/components/lost-found/LostFoundBuilder";
import { getLostFoundSelection } from "@/lib/lost-found";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  searchParams: Promise<{ pkg?: string }>;
};

export const metadata: Metadata = pageMeta({
  title: "Compose Lost & Found Notice",
  description:
    "Write your lost & found notice, check the package price and pay securely online.",
  path: "/lost-and-found/book",
  noIndex: true,
});

export default async function LostAndFoundBookPage({ searchParams }: Props) {
  const query = await searchParams;
  const selection = getLostFoundSelection(query.pkg);

  if (!selection) {
    redirect("/lost-and-found");
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Lost & found ads", path: "/lost-and-found" },
          { name: "Compose lost & found notice", path: "/lost-and-found/book" },
        ])}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-charcoal">
            <Link href="/lost-and-found" className="font-semibold text-maroon hover:underline">
              ← Back to lost &amp; found packages
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
          Please enable JavaScript to compose and pay for the lost &amp; found notice.
        </p>
      </noscript>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <LostFoundBuilder
          booking={{
            id: selection.id,
            name: selection.name,
            label: selection.label,
            cities: selection.city,
            unit: selection.unit,
            unitNote: selection.unitNote,
            rate: selection.rate ?? 0,
            unitType: "lines",
            includedLines: selection.lines,
            papers: selection.papers,
          }}
        />
      </div>
    </>
  );
}
