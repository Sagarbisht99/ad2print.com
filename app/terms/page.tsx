import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Terms of Service",
  description: "Terms governing AD2PRINT newspaper ad booking, payment, publication, and refunds.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Legal</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Terms of Service</h1>
      <p className="mt-3 text-sm text-charcoal">Last updated: August 2026</p>

      <div className="prose-legal mt-10 space-y-8 text-[15px] leading-relaxed text-charcoal">
        <section>
          <h2 className="font-display text-xl text-ink">1. About AD2PRINT</h2>
          <p className="mt-3">
            AD2PRINT ({SITE.name}) helps you book classified and display advertisements in Indian
            newspapers. By using our website or placing an order, you agree to these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">2. Booking &amp; rates</h2>
          <p className="mt-3">
            Rates shown on the site are indicative starting prices. Final charges depend on
            newspaper, edition, size, language, colour, page preference, and publication date.
            We confirm the final amount before payment or publication.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">3. Your content</h2>
          <p className="mt-3">
            You are responsible for the text, images, and claims in your ad. Content must not be
            illegal, defamatory, misleading, or prohibited by the newspaper or applicable law. We
            may refuse or edit bookings that violate publisher guidelines.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">4. Proofs &amp; deadlines</h2>
          <p className="mt-3">
            Where available, we share a proof before print. Edition cut-offs are set by publishers —
            typically late afternoon for next-day print. Late approvals may shift to a later date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">5. Payment</h2>
          <p className="mt-3">
            Ads are normally published after payment is received (unless we agree otherwise in
            writing). Failed or reversed payments may cancel or hold the booking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">6. Cancellations &amp; refunds</h2>
          <p className="mt-3">
            Cancellation and refund eligibility depend on how close you are to the newspaper’s
            deadline and whether the ad has already been processed or printed. Contact us promptly
            at{" "}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-maroon hover:underline">
              {SITE.email}
            </a>{" "}
            or{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-semibold text-maroon hover:underline"
            >
              {SITE.phone}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">7. Publisher control</h2>
          <p className="mt-3">
            Newspapers retain the right to accept, reject, reposition, or reschedule ads. AD2PRINT
            acts as a booking intermediary and is not the publisher.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">8. Liability</h2>
          <p className="mt-3">
            To the extent permitted by law, AD2PRINT is not liable for indirect losses, missed
            business opportunities, or publisher-side errors beyond arranging a reasonable remedy
            (such as a correction or re-run where the publisher agrees).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">9. Contact</h2>
          <p className="mt-3">
            Questions about these Terms:{" "}
            <Link href="/contact" className="font-semibold text-maroon hover:underline">
              Contact us
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
