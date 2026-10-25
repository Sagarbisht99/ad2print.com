import Image from "next/image";

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
    </section>
  );
}
