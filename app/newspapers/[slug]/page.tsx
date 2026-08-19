import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/EnquiryForm";
import { NewspaperLogo, NewspaperWall } from "@/components/NewspaperWall";
import {
  formatCopies,
  formatPrice,
  getNewspaper,
  getNewspapers,
  getRelatedNewspapers,
} from "@/lib/data";
import { AD_TYPES } from "@/lib/site";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getNewspapers().map((paper) => ({ slug: paper.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paper = getNewspaper(slug);
  if (!paper) return { title: "Newspaper" };
  return pageMeta({
    title: `Advertise in ${paper.name}`,
    description: `Book classified and display ads in ${paper.name} (${paper.language}, ${paper.region}). Editions in ${paper.cities.slice(0, 6).join(", ")}. Rates from AD2PRINT.`,
    path: `/newspapers/${paper.slug}`,
    keywords: [`${paper.name} ads`, `${paper.name} classifieds`, "newspaper advertising India"],
  });
}

export default async function NewspaperDetailPage({ params }: Props) {
  const { slug } = await params;
  const paper = getNewspaper(slug);
  if (!paper) notFound();

  const related = getRelatedNewspapers(paper.slug);
  const copies = formatCopies(paper.copies ?? 0);
  const adTypes = AD_TYPES.filter((type) => paper.adTypes.includes(type.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Newspapers", path: "/newspapers" },
          { name: paper.name, path: `/newspapers/${paper.slug}` },
        ])}
      />
      <Link href="/newspapers" className="text-sm font-medium text-maroon hover:underline">
        ← All newspapers
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-line bg-white px-3">
              <NewspaperLogo paper={paper} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-maroon">
                {paper.language} · {paper.region}
              </p>
              <h1 className="mt-1 font-display text-4xl text-ink sm:text-5xl">{paper.name}</h1>
              <p className="mt-3 max-w-xl text-lg text-charcoal">
                Book text classified, classified display, and display ads in {paper.name}. Rates
                start from {formatPrice(paper.fromPrice)} depending on edition and format.
              </p>
            </div>
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            <Stat label="From" value={formatPrice(paper.fromPrice)} />
            <Stat label="Language" value={paper.language} />
            <Stat label="Circulation" value={copies ?? "On request"} />
          </dl>

          <div className="mt-10">
            <h2 className="font-display text-2xl text-ink">Editions</h2>
            <p className="mt-2 text-sm text-charcoal">
              Pick the city edition that covers your readers. We confirm the exact rate before
              booking.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {paper.cities.map((city) => (
                <span
                  key={city}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-slate-deep"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl text-ink">Formats in this paper</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {adTypes.map((type) => (
                <div key={type.slug} className="overflow-hidden border border-line bg-white">
                  <div className="bg-paper-2 p-3">
                    <Image
                      src={type.image}
                      alt={`Sample ${type.name}`}
                      width={234}
                      height={166}
                      unoptimized
                      className="mx-auto h-auto w-full max-w-[234px] object-contain"
                    />
                  </div>
                  <div className="border-t border-line px-4 py-3">
                    <p className="font-display text-sm text-ink">{type.name}</p>
                    <p className="text-xs text-charcoal">From {formatPrice(type.fromPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-line bg-white p-6 sm:p-7">
          <h2 className="font-display text-2xl text-ink">Enquire for {paper.name}</h2>
          <p className="mt-2 text-sm text-charcoal">
            Share your details — we reply with edition, rate, and a draft.
          </p>
          <div className="mt-5">
            <EnquiryForm
              compact
              source="newspaper"
              categoryName={paper.name}
              submitLabel="Send enquiry"
              defaultMessage={`I want to book an ad in ${paper.name}.`}
            />
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <div className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl text-ink">More {paper.language} papers</h2>
          <div className="mt-6 rounded-xl border border-line bg-paper-2/50 p-4">
            <NewspaperWall papers={related} maxHeight={360} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal">{label}</dt>
      <dd className="mt-1 font-display text-xl text-ink">{value}</dd>
    </div>
  );
}
