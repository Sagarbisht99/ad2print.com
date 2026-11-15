import type { Metadata } from "next";
import Link from "next/link";
import { AUDIENCES, SERVICES } from "@/components/home/Sections";
import { JsonLd } from "@/components/JsonLd";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageMeta,
  SITE_URL,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About Our Newspaper Ad Booking Desk",
  description:
    "AD2PRINT is an online newspaper ad booking desk in Indirapuram, Ghaziabad. Book classified and display ads in 280+ Indian papers. Proof after print.",
  path: "/about",
  keywords: [
    "about AD2PRINT",
    "newspaper ad booking desk",
    "newspaper advertising agency Ghaziabad",
    "classified ads India",
    "book newspaper ad online",
  ],
});

const STATS = [
  { value: "280+", label: "Newspapers" },
  { value: "15", label: "Languages" },
  { value: "1.5L+", label: "Ads booked" },
  { value: "Next-day", label: "Publication*" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          webPageJsonLd({
            path: "/about",
            name: "About AD2PRINT newspaper ad booking desk",
            description:
              "AD2PRINT books classified and display ads in 280+ Indian newspapers from its Indirapuram, Ghaziabad desk.",
          }),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": `${absoluteUrl("/about")}#about`,
            url: absoluteUrl("/about"),
            name: "About AD2PRINT",
            description:
              "Newspaper classified and display ad booking desk serving advertisers across India.",
            mainEntity: { "@id": `${SITE_URL}/#business` },
          },
        ]}
      />
      <p className="section-kicker">About</p>
      <h1 className="mt-3 font-display text-5xl text-maroon sm:text-6xl">
        About AD2PRINT — the newspaper ad booking desk
      </h1>
      <div className="mt-5 h-1 w-20 animate-sweep bg-maroon" />
      <p className="mt-8 text-xl leading-relaxed text-ink sm:text-2xl">
        An online booking desk for classified and display ads across Indian newspapers.
      </p>
      <p className="mt-6 text-base leading-relaxed text-charcoal">
        Pick a category, choose your paper, approve a proof, and go to print. Most people place a
        newspaper ad once or twice in a lifetime — that booking should not mean chasing agents.
      </p>
      <p className="mt-6 text-base leading-relaxed text-charcoal">
        We focus on classified text, classified display, and main-page display across national and
        regional titles — including the languages your readers actually buy.
      </p>

      <h2 className="mt-14 font-display text-3xl text-ink">What we book</h2>
      <p className="mt-4 text-base leading-relaxed text-charcoal">
        Most bookings fall into four groups: personal notices such as name change, matrimonial,
        obituary and lost &amp; found; property and vehicle classifieds; recruitment, education and
        business advertising; and statutory, court, tender and public notices. Each category has its
        own accepted wording, minimum size and publication rules, and the desk checks those before
        the ad is released to the newspaper.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "One booking window",
            text: "Compare national and regional papers, choose the city edition and pay once for a single paper or a multi-paper schedule.",
          },
          {
            title: "Drafting included",
            text: "Send the details in any format. We draft and translate the ad, then send a proof for your approval before print.",
          },
          {
            title: "Proof after print",
            text: "After publication you receive the e-paper page for the correct date and edition, plus a GST invoice for your records.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-line bg-paper p-5">
            <h3 className="font-display text-lg text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal">{item.text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-3xl text-ink">Where we book</h2>
      <p className="mt-4 text-base leading-relaxed text-charcoal">
        The booking network covers 280+ newspapers and 15 Indian languages, from national English
        dailies to city and district editions in Hindi, Marathi, Bengali, Gujarati, Tamil, Telugu,
        Kannada, Malayalam, Punjabi, Odia and Urdu. If a title or edition is not listed on the
        website, call the desk — we can usually still confirm availability and the rate.
      </p>

      <h2 className="mt-14 font-display text-3xl text-ink">Who we serve</h2>
      <div className="mt-6 space-y-6">
        {AUDIENCES.map((a) => (
          <div key={a.title} className="border-l-2 border-maroon pl-5">
            <h3 className="font-display text-lg text-ink">{a.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-charcoal">{a.text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-3xl text-ink">What you get</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <li key={s} className="flex gap-2 border-b border-line pb-3 text-sm text-charcoal">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-maroon" />
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-12 grid grid-cols-2 gap-8 border-y border-line py-10">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="font-display text-4xl text-maroon">{s.value}</p>
            <p className="mt-1 text-sm text-charcoal">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate">
        {SITE.hours}. {SITE.cutoff}.
      </p>

      <div className="mt-10">
        <Link href="/contact" className="btn-primary">
          Contact the desk
        </Link>
      </div>
    </div>
  );
}
