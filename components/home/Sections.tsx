const STEPS = [
  {
    step: 1,
    title: "Pick category & paper",
    text: "Choose what you are booking, then the newspaper and city. Rates update as you go so you know the range early.",
  },
  {
    step: 2,
    title: "Compose your matter",
    text: "Type the ad, upload wording from your lawyer, or send a brief. We draft and translate when you need help.",
  },
  {
    step: 3,
    title: "Approve, pay, print",
    text: "Check the proof, pick dates, pay securely. It runs after editorial approval — you get confirmation and page proof.",
  },
];

const GUIDE = [
  {
    step: 1,
    title: "Choose your ad type",
    text: "Text classified is priced per line or word and sits in the classified pages — cheapest for notices. Classified display and display ads are priced per sq. cm and can carry a logo, photo, border, or colour.",
  },
  {
    step: 2,
    title: "Pick newspaper, city & date",
    text: "Choose the paper your readers buy, then the edition that covers your town. Rates and reach differ by edition — this choice drives both cost and response.",
  },
  {
    step: 3,
    title: "Write or upload matter",
    text: "For matrimonial, property, and recruitment we can draft free. Legal notices are published exactly as supplied from your affidavit or counsel.",
  },
  {
    step: 4,
    title: "Pay and confirm",
    text: "You see the total including GST before paying. Book before cutoff for next-day print. Invoice is emailed; afterwards you can view the printed page as proof.",
  },
];

const DEADLINES = [
  {
    title: "Weekday editions",
    text: "Book and approve by ~5 PM for most next-morning papers. Exact cutoff varies by title and city.",
  },
  {
    title: "Sunday peaks",
    text: "Matrimonial and recruitment often run best on Sundays — reserve a day earlier for weekend editions.",
  },
  {
    title: "Urgent bookings",
    text: "Call the desk. If the edition is closed we will say so upfront and offer the next available date.",
  },
];

const SERVICES = [
  "Text classified booking",
  "Classified display with logo / photo",
  "Main-page display ads",
  "Multi-paper package orders",
  "Free ad drafting & translation",
  "Statutory & legal notice publishing",
  "GST invoice on every booking",
  "Publication proof / e-paper page",
];

const AUDIENCES = [
  {
    title: "Individuals",
    text: "Name change, matrimonial, obituary, lost documents, and personal announcements — booked without chasing local agents.",
  },
  {
    title: "Property & vehicles",
    text: "Sale, rent, and vehicle classifieds in city editions where buyers actually read the paper.",
  },
  {
    title: "Businesses & HR",
    text: "Recruitment, retail offers, launches, and display campaigns with clear rates before you commit.",
  },
  {
    title: "Legal & company secretarial",
    text: "Statutory notices for company, shares, property, and recovery — published in the format authorities expect.",
  },
];

const FEATURES = [
  {
    id: "rates",
    title: "Live rates before you pay",
    text: "See the edition cost for your category up front — including GST — then book. No surprise add-ons after you send the matter.",
  },
  {
    id: "multi",
    title: "Many papers, one order",
    text: "Add a national title and a regional language daily together, pay once, and track every booking from one desk.",
  },
  {
    id: "write",
    title: "We draft & translate",
    text: "Send details or a handwritten photo. We write the matter in Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Malayalam, Kannada, and more — free.",
  },
  {
    id: "proof",
    title: "Proof it ran",
    text: "Approve a proof before print. After publication, get the page or e-paper reference for your records and applications.",
  },
  {
    id: "languages",
    title: "Every language that sells",
    text: "English nationals matter for prestige; regional dailies often convert better for matrimonial, property, and local notices.",
  },
  {
    id: "support",
    title: "Human desk, not just a form",
    text: "Call or WhatsApp when the deadline is tight. We tell you honestly if tomorrow’s edition is still open.",
  },
];

export function WhoBooks() {
  return (
    <section className="border-b border-line bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Who books here</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
          Built for one-time notices and repeat campaigns
        </h2>
        <p className="mt-4 max-w-2xl text-charcoal">
          Whether you are placing a single legal notice or a multi-city recruitment burst, the
          booking path stays the same: category, paper, matter, proof, print.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="border-t-2 border-slate pt-5">
              <h3 className="font-display text-lg text-ink">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">How it works</p>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          Three steps, mostly done for you
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.step}>
              <span className="font-display text-5xl text-maroon/20">
                {String(step.step).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-xl text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function GuideSection() {
  return (
    <section className="bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Guide</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
          How to give an advertisement in a newspaper
        </h2>
        <p className="mt-3 max-w-2xl text-charcoal">
          The same four decisions whether you are placing a few classified lines or a full-page
          display ad.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {GUIDE.map((g) => (
            <div key={g.step} className="border border-line bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-maroon">Step {g.step}</p>
              <h3 className="mt-2 font-display text-xl text-ink">{g.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeadlinesServices() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Deadlines</p>
          <h2 className="mt-3 font-display text-3xl text-ink">When will it print?</h2>
          <div className="mt-8 space-y-6">
            {DEADLINES.map((d) => (
              <div key={d.title} className="border-l-2 border-maroon pl-5">
                <h3 className="font-display text-lg text-ink">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Services</p>
          <h2 className="mt-3 font-display text-3xl text-ink">What AD2PRINT handles</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2 border-b border-line pb-3 text-sm text-charcoal"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function WhyFeatures() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-maroon">
          Why book with AD2PRINT
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl text-ink sm:text-4xl">
          You&apos;ve decided to advertise. Here&apos;s why book it here.
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.id} className="text-left">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                →
              </span>
              <h3 className="mt-4 font-display text-lg text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { AUDIENCES, SERVICES };
