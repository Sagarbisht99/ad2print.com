import type { Metadata } from "next";
import Link from "next/link";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Cancellation & Refund Policy",
  description:
    "Cancellation and refund policy for newspaper advertisements booked with AD2PRINT — cancellation window, charges, and refund timelines.",
  path: "/refund",
});

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Legal</p>
          <h1 className="mt-3 font-display text-4xl text-ink">Cancellation &amp; Refund Policy</h1>
          <p className="mt-3 text-sm text-charcoal">Last updated: October 2026</p>

          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-charcoal">
            <section>
              <h2 className="font-display text-xl text-ink">Refund &amp; cancellation</h2>
              <p className="mt-3">
                All advertisements at {SITE.name} are accepted in good faith. In the event of the
                advertiser wishing to cancel the ad, he/she has to inform us in writing within{" "}
                <strong className="text-ink">12 hours</strong> of placing the order from the
                website. The entire amount except the cancellation charges of{" "}
                <strong className="text-ink">10% of the billing amount</strong> shall be refunded
                back to the advertiser within 7 working days.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-ink">Stop orders / cancellations</h2>
              <p className="mt-3">
                The management shall not be bound by notices to stop orders, cancellations,
                preponements/postponements or alterations/deletions/additions in the material(s) of
                advertisement(s) booked for publication.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-ink">Non-tangible, irrevocable goods</h2>
              <p className="mt-3">
                {SITE.name} is offering non-tangible, irrevocable goods. We do not issue refunds
                after 12 hours of order placing time.
              </p>
              <p className="mt-3">
                As a customer, you are responsible for understanding this upon booking any kind of
                advertisement at our site. Please note that we are associated with different
                publications and they do not provide any refund or chargeback.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-ink">If the ad does not appear</h2>
              <p className="mt-3">
                In the event of the ad not appearing in the newspaper, no compensation shall be
                given for loss of day. We will, however, work with the publication to run the
                notice on the next available date wherever possible.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-ink">How to request a cancellation</h2>
              <p className="mt-3">
                Send your booking details in writing to{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-semibold text-maroon hover:underline"
                >
                  {SITE.email}
                </a>{" "}
                or message the desk on WhatsApp at {SITE.phone} within the 12-hour window. Refunds
                are processed to the original payment method within 7 working days of approval.
              </p>
            </section>
          </div>
        </div>

        <aside className="h-fit border border-line bg-paper-2/60 p-6 rounded-xl">
          <h2 className="font-display text-2xl text-ink">Contact Us</h2>
          <p className="mt-4 text-sm text-charcoal">Need Help Call @</p>
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="mt-1 inline-flex items-center gap-2 font-display text-lg text-maroon hover:underline"
          >
            <FaPhoneAlt className="h-4 w-4" aria-hidden />
            {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-3 flex items-center gap-2 text-sm text-maroon hover:underline"
          >
            <FaEnvelope className="h-4 w-4 shrink-0" aria-hidden />
            <span className="break-all">{SITE.email}</span>
          </a>
          <Link href="/contact" className="btn-primary mt-5 inline-flex w-full">
            Send an enquiry
          </Link>
          <p className="mt-4 text-xs leading-relaxed text-charcoal">{SITE.hours}</p>
        </aside>
      </div>
    </div>
  );
}
