import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AD2PRINT collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Legal</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Privacy Policy</h1>
      <p className="mt-3 text-sm text-charcoal">Last updated: August 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-charcoal">
        <section>
          <h2 className="font-display text-xl text-ink">1. What we collect</h2>
          <p className="mt-3">
            When you book an ad or contact us, we may collect your name, phone number, email,
            city, ad copy, and payment-related details needed to process the order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">2. How we use it</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>To quote rates, draft ads, and place bookings with newspapers</li>
            <li>To send proofs, invoices, and status updates</li>
            <li>To respond to call-back, WhatsApp, or contact-form requests</li>
            <li>To improve our website and service quality</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">3. Sharing</h2>
          <p className="mt-3">
            We share only what is necessary with newspapers, payment processors, and support tools
            to complete your booking. We do not sell your personal data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">4. Cookies &amp; analytics</h2>
          <p className="mt-3">
            Our site may use basic cookies or analytics to understand traffic and fix issues. You
            can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">5. Retention &amp; security</h2>
          <p className="mt-3">
            We keep booking records as long as needed for service, accounting, and legal
            requirements. We take reasonable steps to protect information, but no method of
            transmission is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">6. Your choices</h2>
          <p className="mt-3">
            To update or delete contact details we hold for you (where feasible), email{" "}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-maroon hover:underline">
              {SITE.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">7. Contact</h2>
          <p className="mt-3">
            Privacy questions:{" "}
            <Link href="/contact" className="font-semibold text-maroon hover:underline">
              Contact form
            </Link>{" "}
            or call {SITE.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}
