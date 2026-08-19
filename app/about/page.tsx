import type { Metadata } from "next";
import Link from "next/link";
import { AUDIENCES, SERVICES } from "@/components/home/Sections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About Us",
  description:
    "AD2PRINT is a newspaper ad booking desk in Indirapuram, Ghaziabad. Book classified and display ads across India with clear rates and publication proof.",
  path: "/about",
  keywords: ["AD2PRINT about", "newspaper ad agency Ghaziabad", "classified ads India"],
});

const STATS = [
  { value: "280+", label: "Newspapers" },
  { value: "15", label: "Languages" },
  { value: "1.5L+", label: "Ads booked" },
  { value: "Next-day", label: "Publication*" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">About</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{SITE.name}</h1>
      <div className="mt-4 h-1 w-16 bg-maroon" />
      <p className="mt-8 text-lg leading-relaxed text-charcoal">
        AD2PRINT is an online booking desk for classified and display ads across Indian newspapers.
        Pick a category, choose your paper, approve a proof, and go to print.
      </p>
      <p className="mt-6 text-base leading-relaxed text-charcoal">
        Most people place a newspaper ad once or twice in a lifetime — for a name change, a public
        notice, a matrimonial match, or a property sale. That booking should not mean chasing agents
        or guessing rates. AD2PRINT shows the path: category, paper, city, matter, proof, print.
      </p>
      <p className="mt-6 text-base leading-relaxed text-charcoal">
        We focus on classified text, classified display, and main-page display across national and
        regional titles — including the languages your readers actually buy.
      </p>

      <h2 className="mt-12 font-display text-2xl text-ink">Who we serve</h2>
      <div className="mt-6 space-y-5">
        {AUDIENCES.map((a) => (
          <div key={a.title} className="border-l-2 border-maroon pl-4">
            <h3 className="font-semibold text-ink">{a.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-charcoal">{a.text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl text-ink">What you get</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <li key={s} className="flex gap-2 border-b border-line pb-3 text-sm text-charcoal">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" />
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-12 grid grid-cols-2 gap-6 border-y border-line py-8">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl text-maroon">{s.value}</p>
            <p className="mt-1 text-sm text-charcoal">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate">
        {SITE.hours}. {SITE.cutoff}.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-full bg-maroon px-6 py-3.5 text-sm font-semibold !text-white hover:bg-maroon-deep"
        >
          Contact the desk
        </Link>
      </div>
    </div>
  );
}
