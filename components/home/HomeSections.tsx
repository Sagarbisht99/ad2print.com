import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaClock, FaFileInvoiceDollar, FaPenNib, FaRegCalendarAlt, FaRegNewspaper, FaRegSquare, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import { CategoryIcon } from "@/components/CategoryIcon";
import { getCategoryHref } from "@/lib/category-routes";
import { getCategories, type Category } from "@/lib/data";
import { SITE } from "@/lib/site";

export function CategoryGrid() {
  const categories = getCategories();

  return (
    <section id="categories" className="scroll-mt-24 border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">What we advertise</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-5xl">
              What type of ad are you looking to book?
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
          >
            All categories <FaArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-11 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={getCategoryHref(category.slug)}
              className="group relative flex flex-col items-start rounded-xl border border-line bg-white p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-maroon/45 hover:shadow-[0_16px_36px_rgba(178,31,45,0.1)] sm:p-5"
            >
              {category.popular ? (
                <span className="absolute right-3 top-3 text-[9px] font-bold uppercase tracking-[0.12em] text-maroon sm:text-[10px]">
                  Popular
                </span>
              ) : null}
              <span
                className="flex h-11 w-11 items-center justify-center rounded-lg transition duration-200 group-hover:scale-105 sm:h-12 sm:w-12"
                style={{ background: `${category.tint}18`, color: category.tint }}
              >
                <CategoryIcon name={category.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <span className="mt-4 font-display text-[15px] leading-snug text-ink group-hover:text-maroon sm:text-lg">
                {category.name}
              </span>
              <span className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-charcoal sm:text-sm">
                {category.short}
              </span>
              <span className="mt-auto pt-4 text-[11px] font-semibold text-maroon sm:text-sm">
                View formats &amp; book
                <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const COST_UNITS = [
  {
    title: "Per line, word or character",
    text: "Classified text ads",
    note: "Most notices, name changes and matrimonial ads use this unit.",
  },
  {
    title: "Per sq. cm",
    text: "Classified display ads",
    note: "Boxed ads with a logo, photo or custom type in the classified pages.",
  },
  {
    title: "Per sq. cm",
    text: "Main-page display ads",
    note: "Larger ads placed alongside news — priced by page, position and colour.",
  },
];

const COST_FACTORS = [
  {
    title: "The newspaper and its edition",
    text: "Rates are set per city edition, not per newspaper. The same ad can cost differently in two editions of one paper.",
    icon: FaRegNewspaper,
  },
  {
    title: "The length or size",
    text: "Text classifieds are priced by the line, word or character. Display ads are priced as width × height × the edition's rate.",
    icon: FaRegSquare,
  },
  {
    title: "The day and page",
    text: "Sunday, festival and premium page positions cost more. We confirm the exact date and position before you pay.",
    icon: FaRegCalendarAlt,
  },
];

const TIMING_CARDS = [
  {
    title: "You pick the date",
    text: "Choose the publish date during the booking. The ad runs after the newspaper's editorial approval.",
    icon: FaRegCalendarAlt,
  },
  {
    title: "Sunday editions",
    text: "Matrimonial and recruitment peak on Sunday. Book a day earlier for the weekend edition.",
    icon: FaRegNewspaper,
  },
  {
    title: "Display ads",
    text: "A specialist usually confirms the rate within the hour. Display bookings need artwork approval and, for premium positions, more notice.",
    icon: FaPenNib,
  },
  {
    title: "If it is urgent",
    text: "Call the desk. If tomorrow's edition is closed we will say so upfront and offer the next available date.",
    icon: FaClock,
  },
];

export function CostAndTiming() {
  return (
    <section id="rates" className="scroll-mt-24 border-b border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="section-kicker">What it costs</p>
          <h2 className="mt-3 font-display text-3xl leading-[1.05] text-ink sm:text-[2.85rem]">
            How much does a newspaper ad cost?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal sm:text-base">
            The cost of a newspaper ad depends on the ad type, the newspaper, the city edition and
            the length or size of the ad. 5% GST is added, and you see the final figure before you
            pay.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {COST_UNITS.map((unit) => (
              <div key={`${unit.title}-${unit.text}`} className="rounded-xl border border-line bg-paper-2/50 p-4">
                <p className="text-sm font-bold leading-snug text-maroon">{unit.title}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal">
                  {unit.text}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate">{unit.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {COST_FACTORS.map((factor) => (
              <div key={factor.title} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon/[0.06] text-maroon">
                  <factor.icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink">{factor.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal sm:text-[13px]">{factor.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline">
            Get the live rate for your paper and city <FaArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        <div>
          <p className="section-kicker">How soon it runs</p>
          <h2 className="mt-3 font-display text-3xl leading-[1.05] text-ink sm:text-[2.85rem]">
            How far in advance should you book a newspaper ad?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal sm:text-base">
            For most editions, a classified ad booked and approved by about 5 PM prints in the
            next morning&apos;s newspaper. Weekend, festival and display bookings need a little more
            time.
          </p>

          <div className="mt-8 space-y-3">
            {TIMING_CARDS.map((card) => (
              <div key={card.title} className="flex gap-4 rounded-xl border border-line bg-white p-4 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon/[0.06] text-maroon">
                  <card.icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink sm:text-[15px]">{card.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal sm:text-[13px]">{card.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-xl border border-maroon/30 px-4 py-2.5 text-sm font-semibold text-maroon transition hover:bg-maroon hover:text-white"
            >
              <FaClock className="h-3.5 w-3.5" aria-hidden /> Check today&apos;s cut-off
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b6b37] hover:underline"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden /> WhatsApp the desk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceHighlights() {
  return (
    <section className="border-b border-line bg-paper-2/60">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-16">
        <div className="flex flex-col rounded-xl border border-line bg-white p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-deep text-white">
            <FaRegNewspaper className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
            One order, every paper
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink sm:text-[1.7rem]">
            Book many newspapers in a single window
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal">
            Add a national and a regional paper to one order, pay once, and track it together.
            Useful for passport combinations, multi-city notices and family announcements.
          </p>
        </div>

        <div className="flex flex-col rounded-xl border border-line bg-white p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-deep text-white">
            <FaPenNib className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
            We write &amp; translate — free
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink sm:text-[1.7rem]">
            Don&apos;t know what to write? We do it for you
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal">
            Send a few details — even a photo of handwritten matter — and we draft, translate into
            your language and show a proof. You approve it before it prints.
          </p>
        </div>
      </div>
    </section>
  );
}

const STATUTORY_COLUMNS = [
  {
    heading: "Company",
    items: [
      "Unaudited financial results",
      "Board meeting",
      "Annual general meeting",
      "Inviting fixed deposits",
      "Amalgamation / mergers",
      "Change of registered address",
    ],
  },
  {
    heading: "Shares",
    items: [
      "Lost share certificate",
      "IPO / rights issue",
      "Buyback of shares",
      "Transfer to IEPF",
      "Result of postal ballot",
      "E-voting notice",
    ],
  },
  {
    heading: "Property",
    items: [
      "Land verification",
      "Lost deed",
      "Possession notice",
      "Public notice",
      "Change of title",
      "Mutation notice",
    ],
  },
  {
    heading: "Recovery",
    items: [
      "Auction notice",
      "Demand notice",
      "Insolvency notice",
      "Tender / e-tender",
      "Court notice",
      "Lender notice",
    ],
  },
];

export function StatutoryNotices() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-2xl border border-line bg-paper-2/45 p-5 sm:p-8">
          <p className="inline-flex items-center gap-2 font-display text-2xl text-ink sm:text-3xl">
            <FaShieldAlt className="h-5 w-5 text-maroon" aria-hidden />
            Statutory &amp; legal notices
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-charcoal">
            Company, share, property and recovery notices — we know the format each registrar and
            court expects.
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATUTORY_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-deep">
                  {column.heading}
                </h3>
                <ul className="mt-3 space-y-2.5 border-t border-line pt-3">
                  {column.items.map((item) => (
                    <li key={item}>
                      <Link
                        href="/categories/statutory#notice-types"
                        className="group inline-flex items-start gap-2 text-sm text-charcoal transition hover:text-maroon"
                      >
                        <span className="mt-1 text-[10px] text-maroon" aria-hidden>
                          ›
                        </span>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link
            href="/categories/statutory"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
          >
            See all statutory notice formats <FaArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    title: "Lowest rate, guaranteed",
    text: "We buy across papers and cities, so we know the real rate — and pass it on. Find it cheaper and we will match it.",
    icon: FaFileInvoiceDollar,
  },
  {
    title: "One window, every paper",
    text: "Book a national and regional paper in a single order, one payment, and no running between agencies.",
    icon: FaRegNewspaper,
  },
  {
    title: "We write & translate it",
    text: "Free drafting and faithful translation in 10+ languages — send even handwritten matter.",
    icon: FaPenNib,
  },
  {
    title: "Proof it ran",
    text: "Approve a proof before printing and get the e-paper PDF of the exact page after publication.",
    icon: FaCheckCircle,
  },
];

export function WhyFeatures() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-maroon/[0.055] text-maroon">
                <feature.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-lg text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const GLANCE = [
  { value: "280+", label: "Newspapers", note: "National and regional, across Indian languages" },
  { value: "15", label: "Languages", note: "Drafting and translation included" },
  { value: "Live", label: "Rates", note: "The real cost, shown before you pay" },
  { value: "Next-day", label: "Publication", note: "Book before the edition cut-off" },
  { value: "5%", label: "GST", note: "Included in the total you see" },
  { value: "e-paper", label: "Proof", note: "View the page online after publication" },
];

export function WhyChoose() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div>
          <p className="section-kicker">Newspaper advertising</p>
          <h2 className="mt-3 font-display text-3xl leading-[1.03] text-ink sm:text-[2.9rem]">
            Why advertisers choose <span className="text-maroon">AD2PRINT.</span>
          </h2>
          <p className="mt-5 max-w-2xl font-display text-lg font-medium leading-relaxed text-slate-deep sm:text-xl">
            Booking a newspaper advertisement used to mean finding an agent, taking the rate on
            trust and hoping it ran. AD2PRINT makes the rate visible before you pay and lets you
            book any paper, in any city, in minutes.
          </p>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
            <span className="float-left mr-2 mt-1 font-display text-5xl leading-[0.72] text-maroon">
              M
            </span>
            ost people place a newspaper ad once or twice in a lifetime — for a name change, a
            public notice, a matrimonial match, a property sale. That single booking has always
            been the awkward part: which paper to use, which edition actually covers the town, what
            a few lines really cost, and who to trust with the wording. AD2PRINT exists to make
            that one booking simple.
          </p>

          <div className="mt-8 divide-y divide-line border-y border-line">
            {[
              {
                title: "See the rate before you pay",
                text: "Choose the newspaper and city and the live rate route for your category is shown before you book. No hidden agent margin after the fact.",
              },
              {
                title: "In the next day's paper",
                text: "Book online before the edition cut-off and the ad runs in the next day's paper, subject to editorial approval.",
              },
              {
                title: "Free drafting for response ads",
                text: "We draft and translate matrimonial, property, recruitment and announcement ads for you, free of charge.",
              },
            ].map((item) => (
              <div key={item.title} className="py-4">
                <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-charcoal">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/categories" className="btn-primary">
              Choose a category <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Talk to the desk
            </Link>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-white p-6 sm:p-8 lg:sticky lg:top-28">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-maroon">At a glance</p>
          <div className="mt-5 divide-y divide-line border-t border-line">
            {GLANCE.map((item) => (
              <div key={item.label} className="flex gap-4 py-4">
                <p className="w-24 shrink-0 font-display text-xl text-ink sm:text-2xl">{item.value}</p>
                <div>
                  <p className="text-sm font-bold text-ink">{item.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-charcoal">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-slate">
            Indicative figures — the exact rate is finalised per newspaper and edition. Rates
            exclude 5% GST unless stated.
          </p>
        </aside>
      </div>
    </section>
  );
}

export function RatesCta() {
  return (
    <section className="bg-paper-2/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-7 rounded-2xl border border-[#eadfc7] bg-[#f7f1e4] px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-2xl text-ink sm:text-4xl">
              See your rate and book in minutes.
            </h2>
            <p className="mt-2 text-sm text-charcoal sm:text-base">
              Real price up front · we write it · runs tomorrow if you book by 5 PM.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-xl bg-maroon px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(200,16,46,0.22)] transition hover:-translate-y-0.5 hover:bg-maroon-deep"
            >
              Get my rate <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-maroon/40 bg-white px-6 py-3.5 text-sm font-bold text-ink transition hover:border-maroon hover:text-maroon"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden /> Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      title: "Pick category & paper",
      text: "Choose what you are booking, then the newspaper and city edition.",
    },
    {
      title: "Compose your matter",
      text: "Type the ad, upload a document, or let us draft and translate it.",
    },
    {
      title: "Approve & pay",
      text: "Check the proof, confirm the date and pay securely. GST invoice included.",
    },
    {
      title: "It prints",
      text: "The ad runs after editorial approval. Collect the e-paper proof after publication.",
    },
  ];

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="section-kicker">How it works</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-5xl">
          Four steps, mostly done for you
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="relative rounded-xl border border-line bg-paper/60 p-5">
              <span className="font-display text-3xl text-maroon/80">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HomeCategoryLinks({ categories }: { categories: Category[] }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
          Popular searches
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/newspaper-classified"
            className="rounded-full border border-maroon/30 bg-maroon/[0.04] px-3.5 py-2 text-xs font-semibold text-maroon transition hover:border-maroon/60"
          >
            Newspaper classified ads
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={getCategoryHref(category.slug)}
              className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
            >
              {category.name} newspaper ad
            </Link>
          ))}
          <Link
            href="/newspapers"
            className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
          >
            All newspapers
          </Link>
        </div>
      </div>
    </section>
  );
}
