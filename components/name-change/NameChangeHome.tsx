import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryTrigger } from "@/components/CategoryTrigger";
import { CityTextList } from "@/components/name-change/CityTextList";
import { getCategories, getNameChangeCities } from "@/lib/data";
import { SITE } from "@/lib/site";

export const NAME_CHANGE_FAQS = [
  {
    q: "How soon can my name change notice be published?",
    a: "Most editions accept material a day before printing. If we get your details and confirmation before the paper's cut-off, the notice usually runs the next publishing day.",
  },
  {
    q: "Do I need an affidavit before booking the ad?",
    a: "The notice normally refers to an affidavit date, so it is best to have it ready. If you do not have one yet, tell the desk and we will explain the order in which to do things.",
  },
  {
    q: "One newspaper or two?",
    a: "Many offices ask for one English and one regional language paper. Tell us which office requested it and we will suggest the safer combination so it is not rejected.",
  },
  {
    q: "What does a name change ad cost?",
    a: "It depends on the paper, the edition, and the number of lines. The desk confirms the amount on WhatsApp before anything is booked.",
  },
  {
    q: "Will I get proof that it was printed?",
    a: "Yes. We send the e-paper clipping with the date and page, and a hard copy on request, which is what most offices accept as proof.",
  },
  {
    q: "Can the notice be in Hindi or another language?",
    a: "Yes. Drafting and translation are included, so the same notice can run in Hindi, Marathi, Tamil, Telugu, or any language the paper prints in.",
  },
  {
    q: "Do I need a name change ad after marriage or divorce?",
    a: "Yes, if you are taking a spouse's surname or reverting to a previous name. Passport Seva, banks, and Aadhaar often ask for a newspaper cutting along with the marriage certificate or court order.",
  },
  {
    q: "What if the spelling on my documents is wrong?",
    a: "A spelling-error notice uses the same classified format. Send both spellings exactly as they appear, and we draft wording that the paper and the office will accept.",
  },
  {
    q: "Which newspapers are accepted for a Gazette name change?",
    a: "Gazette filings usually need one English daily and one regional-language paper from the state where you live. Tell us the state and we will suggest a combination that is commonly accepted.",
  },
];

export const NAME_CHANGE_HOW_TO_STEPS = [
  {
    name: "Draft the notice",
    text: "Enter the old name, new name, father or husband name, address and affidavit date. The classified wording updates live in English or Hindi.",
  },
  {
    name: "Send details to the desk",
    text: "Share your mobile and email. AD2PRINT confirms the paper, edition, line count and booking details before anything is booked.",
  },
  {
    name: "Approve and publish",
    text: "Once you approve the proof, the notice runs in the chosen newspaper. You receive the e-paper clipping and a hard copy on request.",
  },
];

const CHECKLIST = [
  "Affidavit copy (or tell us — we guide you where to get one)",
  "Correct spelling of old and new name, exactly as in records",
  "Father's or husband's name and the address for the notice",
  "Which office asked for it — passport, bank, school, or gazette",
];

export function NameChangeHome() {
  const cities = getNameChangeCities();
  const categories = getCategories();
  return (
    <>
      <CityTextList cities={cities} />

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">Start by category</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-5xl">
            What type of ad are you looking to book?
          </h2>
          <div className="mt-8 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3.5">
            {categories.map((cat) => {
              const pillClass =
                "group inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 text-left text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-maroon/45 hover:shadow-[0_10px_24px_rgba(26,27,30,0.07)] sm:px-5 sm:py-3 sm:text-[15px]";
              const inner = (
                <>
                  <span
                    className="shrink-0 transition group-hover:text-maroon"
                    style={{ color: cat.tint }}
                  >
                    <CategoryIcon name={cat.icon} className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </span>
                  {cat.name}
                </>
              );

              return cat.slug === "matrimonial" || cat.slug === "tender-notice" ? (
                <Link
                  key={cat.slug}
                  href={cat.slug === "matrimonial" ? "/matrimonial" : "/tender-notice"}
                  className={pillClass}
                >
                  {inner}
                </Link>
              ) : (
                <CategoryTrigger key={cat.slug} slug={cat.slug} className={pillClass}>
                  {inner}
                </CategoryTrigger>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="section-kicker">Before you book</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                What we need from you
              </h2>
              <ul className="mt-8 space-y-4">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-charcoal">
                Desk hours {SITE.hours}. Send the draft any time — we reply the same working day.
              </p>
            </div>

            <div>
              <p className="section-kicker">Questions</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                Name change newspaper ad FAQ
              </h2>
              <div className="mt-8 divide-y divide-line border-y border-line">
                {NAME_CHANGE_FAQS.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink sm:text-base [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <span className="mt-0.5 shrink-0 text-maroon transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 pr-8 text-sm leading-relaxed text-charcoal">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
