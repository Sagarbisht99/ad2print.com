import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MatrimonialBuilder } from "@/components/matrimonial/MatrimonialBuilder";
import { getMatrimonialSelection } from "@/lib/matrimonial";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  searchParams: Promise<{ city?: string; papers?: string }>;
};

export const metadata: Metadata = pageMeta({
  title: "Compose Matrimonial Ad",
  description:
    "Write your bride wanted or groom wanted ad, check the package price and pay securely online.",
  path: "/matrimonial/book",
  noIndex: true,
});

export default async function MatrimonialBookPage({ searchParams }: Props) {
  const query = await searchParams;
  const slugs = (query.papers ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const selection = getMatrimonialSelection(slugs, query.city);

  if (!selection) {
    redirect("/matrimonial");
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Matrimonial newspaper ads", path: "/matrimonial" },
          { name: "Compose matrimonial ad", path: "/matrimonial/book" },
        ])}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-charcoal">
            <Link href="/matrimonial" className="font-semibold text-maroon hover:underline">
              ← Back to matrimonial packages
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
          Please enable JavaScript to compose and pay for your matrimonial ad.
        </p>
      </noscript>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <MatrimonialBuilder
          booking={{
            city: selection.city,
            papers: selection.papers,
            label: selection.label,
            unit: selection.unit,
            rate: selection.rate,
          }}
        />
      </div>
    </>
  );
}
