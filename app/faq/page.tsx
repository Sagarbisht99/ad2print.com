import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/home/FaqSection";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about booking newspaper ads with AD2PRINT.",
};

export default function FaqPage() {
  return (
    <div>
      <FaqSection />
      <p className="mx-auto max-w-6xl px-4 pb-14 text-charcoal sm:px-6">
        Still unsure?{" "}
        <Link href="/contact" className="font-semibold text-maroon hover:underline">
          Contact the desk
        </Link>{" "}
        or{" "}
        <Link href="/book" className="font-semibold text-maroon hover:underline">
          start a booking
        </Link>
        .
      </p>
    </div>
  );
}
