import Image from "next/image";
import { SITE } from "@/lib/site";

export function NameChangeBanner() {
  return (
    <section id="name-change" className="overflow-hidden border-b border-line bg-white">
      <div className="relative w-full">
        <Image
          src="/ads/name-change-banner.png"
          alt="Change of name newspaper ad: choose your city, choose newspaper, fill your details, pay online. Need help, call 79829 36243. For Gazette of India, passport, Aadhaar and PAN."
          width={1024}
          height={188}
          priority
          className="hidden h-auto w-full object-contain md:block"
        />
        <h1 className="sr-only">Name Change Newspaper Ad in India</h1>
      </div>
      <div className="border-t border-line bg-paper px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-base font-semibold text-ink sm:flex-row sm:items-center sm:justify-between sm:text-sm sm:font-normal">
          <p>
            Need help? Call{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-bold text-maroon hover:underline"
            >
              {SITE.phone}
            </a>
          </p>
          <p className="text-ink">
            Steps: Choose your city → Choose newspaper → Fill your details → Pay online
          </p>
        </div>
      </div>
    </section>
  );
}
