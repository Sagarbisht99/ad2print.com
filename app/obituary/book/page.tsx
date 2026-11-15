import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ObituaryBuilder } from "@/components/obituary/ObituaryBuilder";
import { getObituarySelection } from "@/lib/obituary";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  searchParams: Promise<{ pkg?: string }>;
};

export const metadata: Metadata = pageMeta({
  title: "Compose Obituary Notice",
  description:
    "Write your obituary or condolence notice and pay securely online. The desk confirms the edition and publication date before print.",
  path: "/obituary/book",
  noIndex: true,
});

export default async function ObituaryBookPage({ searchParams }: Props) {
  const query = await searchParams;
  const selection = getObituarySelection(query.pkg);

  if (!selection) {
    redirect("/obituary");
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Obituary ads in Delhi", path: "/obituary" },
          { name: "Compose obituary notice", path: "/obituary/book" },
        ])}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-charcoal">
            <Link href="/obituary" className="font-semibold text-maroon hover:underline">
              ← Back to obituary packages
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
          Please enable JavaScript to compose and pay for the obituary notice.
        </p>
      </noscript>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <ObituaryBuilder
          booking={{
            id: selection.id,
            name: selection.name,
            label: `${selection.label} · Size ${selection.size} cm`,
            cities: selection.cities,
            unit: selection.unit,
            size: selection.size,
            bw: selection.bw,
            rate: selection.rate ?? 0,
            papers: selection.papers,
          }}
        />
      </div>
    </>
  );
}
