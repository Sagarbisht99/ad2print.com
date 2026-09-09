import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-maroon text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(0,0,0,0.25), transparent 35%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Why AD2PRINT</p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">
            One desk for rates, drafting, and proof.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Book classified and display ads across national and regional papers without chasing
            agents. You see the path — category, paper, matter, proof, print.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
            {SITE.hours}. Most editions close around 5–6 PM for next-day print.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-maroon"
          >
            About the desk
          </Link>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <Image
            src="/ads/toi-front-page.png"
            alt="Sample newspaper front page"
            width={298}
            height={468}
            className="h-auto w-full object-contain shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>
    </section>
  );
}
