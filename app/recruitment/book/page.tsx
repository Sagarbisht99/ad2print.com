import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { RecruitmentBuilder } from "@/components/recruitment/RecruitmentBuilder";
import { getRecruitmentSelection } from "@/lib/recruitment";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  searchParams: Promise<{ pkg?: string }>;
};

export const metadata: Metadata = pageMeta({
  title: "Compose Recruitment Ad",
  description:
    "Write your recruitment ad, check the Delhi-edition package price and pay securely online.",
  path: "/recruitment/book",
  noIndex: true,
});

export default async function RecruitmentBookPage({ searchParams }: Props) {
  const query = await searchParams;
  const selection = getRecruitmentSelection(query.pkg);

  if (!selection) {
    redirect("/recruitment");
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Recruitment ads in Delhi", path: "/recruitment" },
          { name: "Compose recruitment ad", path: "/recruitment/book" },
        ])}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-charcoal">
            <Link href="/recruitment" className="font-semibold text-maroon hover:underline">
              ← Back to recruitment packages
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
          Please enable JavaScript to compose and pay for your recruitment ad.
        </p>
      </noscript>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <RecruitmentBuilder
          booking={{
            id: selection.id,
            name: selection.name,
            label: selection.label,
            cities: selection.cities,
            unit: selection.unit,
            unitNote: selection.unitNote,
            rate: selection.rate ?? 0,
            unitType: selection.unitType,
            includedLines: selection.lines,
            papers: selection.papers,
          }}
        />
      </div>
    </>
  );
}
