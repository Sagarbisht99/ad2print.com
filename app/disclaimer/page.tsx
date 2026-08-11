import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers for AD2PRINT newspaper advertising services.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Legal</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Disclaimer</h1>
      <p className="mt-3 text-sm text-charcoal">Last updated: August 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-charcoal">
        <section>
          <h2 className="font-display text-xl text-ink">Service role</h2>
          <p className="mt-3">
            AD2PRINT is an online booking and facilitation desk for newspaper advertisements. We
            are not a newspaper publisher. Acceptance, placement, and timing of ads are controlled
            by the respective publications.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Rates &amp; availability</h2>
          <p className="mt-3">
            Prices, circulation figures, logos, and edition lists on this website are for guidance.
            Actual rates and space availability can change without notice. Always wait for our
            written confirmation before relying on a quote.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Ad content</h2>
          <p className="mt-3">
            You remain solely responsible for the accuracy and legality of your advertisement.
            Publishing an ad through AD2PRINT does not mean we endorse the product, service, or
            claim advertised.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Third-party brands</h2>
          <p className="mt-3">
            Newspaper names and logos belong to their respective owners and are shown only to help
            you identify publications for booking. No affiliation or endorsement is implied beyond
            ad placement services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">No professional advice</h2>
          <p className="mt-3">
            Information on categories, formats, and FAQs is general guidance — not legal, tax, or
            investment advice. For court notices and similar ads, follow the requirements of the
            relevant authority and newspaper.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">Questions</h2>
          <p className="mt-3">
            Reach us at{" "}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-maroon hover:underline">
              {SITE.email}
            </a>{" "}
            or via the{" "}
            <Link href="/contact" className="font-semibold text-maroon hover:underline">
              contact page
            </Link>
            . See also our{" "}
            <Link href="/terms" className="font-semibold text-maroon hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-maroon hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
