import Image from "next/image";
import Link from "next/link";
import { CityTextList } from "@/components/name-change/CityTextList";
import { getNameChangeCities } from "@/lib/data";
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

const DOCUMENTS = [
  {
    title: "Passport",
    body: "New or re-issue applications with a changed name",
    image: "https://i.pinimg.com/1200x/72/74/f1/7274f17aa6e09c71ecf38656a7ef407a.jpg",
    alt: "Indian passport — name change newspaper notice for passport update",
  },
  {
    title: "Aadhaar",
    body: "Name correction and update requests",
    image: "https://i.pinimg.com/736x/24/69/83/246983a725c33409cd88436fb3b609ea.jpg",
    alt: "Aadhaar card — newspaper ad required for Aadhaar name correction",
  },
  {
    title: "PAN & income tax",
    body: "Records that must match your bank name",
    image: "https://i.pinimg.com/1200x/42/31/96/423196b2f9e9e93b6b24953043e05cfd.jpg",
    alt: "PAN card — name change classified for income tax records",
  },
  {
    title: "Bank & insurance",
    body: "Account, policy, and nominee name updates",
    image: "https://i.pinimg.com/736x/bf/bf/c6/bfbfc6dd4ef41ebfcf95adeaba551b29.jpg",
    alt: "Bank passbook — newspaper notice for account name update",
  },
  {
    title: "School & university",
    body: "Marksheet, degree, and certificate corrections",
    image: "https://i.pinimg.com/736x/e9/d9/38/e9d938f87b330bf9115adc53465cb063.jpg",
    alt: "School certificate — name correction notice for marksheets and degrees",
  },
  {
    title: "Gazette of India",
    body: "Notification filings that ask for a paper cutting",
    image: "https://i.pinimg.com/736x/8d/c3/b6/8dc3b684887cd28f201d10d9ca5b9506.jpg",
    alt: "Gazette of India — newspaper cutting required with gazette name change",
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
  return (
    <>
      <CityTextList cities={cities} />

      <section className="border-b border-line bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">Why it is asked for</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Where Is a Name Change Newspaper Ad Required?
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
            A newspaper name-change advertisement may be required for Passport, Aadhaar, PAN, bank
            records, school certificates, and Gazette applications, depending on the rules of the
            relevant authority.
          </p>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTS.map((doc) => (
              <article
                key={doc.title}
                className="group overflow-hidden border border-line bg-white transition hover:-translate-y-0.5 hover:border-maroon/40 hover:shadow-[0_16px_36px_rgba(26,27,30,0.08)] rounded-xl"
              >
                <div className="relative aspect-video overflow-hidden bg-paper-2">
                  <Image
                    src={doc.image}
                    alt={doc.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                    className="object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="px-4 py-4 sm:px-5">
                  <h3 className="font-display text-base text-ink sm:text-lg">{doc.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal">{doc.body}</p>
                </div>
              </article>
            ))}
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

      <section className="bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 sm:px-6 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl text-white sm:text-4xl">
              Still unsure about the wording?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70 sm:text-base">
              Send us what the office asked for. We will draft the name change notice, confirm the
              paper, and book it after you approve.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link href="#cities" className="btn-primary w-full sm:w-auto">
              Draft my notice
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-sm border-2 border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5 sm:w-auto"
            >
              Talk to the desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
