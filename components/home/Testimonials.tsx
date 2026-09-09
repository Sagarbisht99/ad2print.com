import { TestimonialSlider } from "@/components/home/TestimonialSlider";

export function Testimonials() {
  return (
    <section className="border-y border-line bg-paper-2/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Reviews</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl text-ink sm:text-5xl">
              What people say after their ad runs
            </h2>
          </div>
          <div className="border border-line bg-white px-5 py-3">
            <p className="font-display text-2xl text-ink">
              4.8 <span className="text-maroon">★</span>
            </p>
            <p className="text-xs text-charcoal">Verified advertiser feedback</p>
          </div>
        </div>

        <div className="mt-10">
          <TestimonialSlider />
        </div>

        <blockquote className="mt-16 border-y border-line py-10">
          <p className="max-w-3xl font-display text-2xl leading-snug text-ink sm:text-4xl">
            You have already decided to advertise. The only questions left are which newspaper, what
            it costs, and how soon it can run — those are the three we answer.
          </p>
          <footer className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-maroon">
            AD2PRINT
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
