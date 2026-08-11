import Image from "next/image";
import { SITE } from "@/lib/site";

export function WhyChooseUs() {
  return (
    <section className="relative bg-[#eef1f8] pb-20 pt-16 sm:pb-24 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div>
          <h2 className="font-display text-3xl text-ink sm:text-4xl md:text-[2.6rem]">
            Why {SITE.name}?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/90 sm:text-[1.05rem]">
            We are a focused newspaper advertising desk — helping individuals and businesses book
            classified and display ads across national and regional papers, with clear rates,
            drafting support, and publication proof.
          </p>
          <p className="mt-5 text-base leading-relaxed text-ink/90 sm:text-[1.05rem]">
            A one-stop print advertising platform that makes booking media ads quick, easy and
            stress-free — from your home, office, or even on holiday. Pick the category, choose the
            paper, approve a proof, and go to print.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#f7f8fc] to-[#e8ecf6] p-6 shadow-[0_20px_50px_rgba(46,47,50,0.1)] sm:p-8">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-maroon/10" aria-hidden />
            <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-slate/10" aria-hidden />
            <div className="relative flex items-end justify-center gap-4">
              <div className="relative z-[1] w-[42%]">
                <div className="rounded-xl border border-line bg-white p-3 shadow-md">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={160}
                    height={160}
                    className="mx-auto h-auto w-full object-contain"
                  />
                </div>
                <div className="mt-3 flex justify-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-white">
                    Ad
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-deep text-[10px] font-bold text-white">
                    Print
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-[10px] font-bold text-white">
                    24×7
                  </span>
                </div>
              </div>
              <div className="relative z-[1] w-[48%] -rotate-2">
                <Image
                  src="/ads/toi-front-page.png"
                  alt="Newspaper advertising sample"
                  width={298}
                  height={468}
                  className="h-auto w-full rounded-sm object-contain shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-line bg-white px-6 py-5 text-center shadow-[0_16px_40px_rgba(46,47,50,0.12)] sm:flex-row sm:gap-5 sm:px-8 sm:text-left">
          <GoogleMark />
          <div className="min-w-0">
            <p className="text-sm text-ink sm:text-base">
              rated us <span className="font-bold">Excellent</span>
            </p>
            <div className="mt-1 flex items-center justify-center gap-0.5 sm:justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-lg text-[#f4b400]">
                  ★
                </span>
              ))}
            </div>
            <p className="mt-1 text-sm text-charcoal">
              with the GoogleRate <span className="font-bold text-ink">4.8</span> out of 5 based on{" "}
              <span className="font-bold text-ink">346</span> customer reviews.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9Z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7 12.9 19.6C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.3 5.2C39.3 36.9 44 32 44 24c0-1.3-.1-2.7-.4-3.9Z"
      />
    </svg>
  );
}
