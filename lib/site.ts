/** Site contact & branding — edit here, not in JSON */
export const SITE = {
  name: "AD2PRINT",
  phone: "+91 97160 82437",
  whatsapp: "919716082437",
  email: "book@ad2print.in",
  address: "382-B, Nyay Khand 1, Indirapuram, Ghaziabad, U.P. 201014",
  hours: "Desk support: 9:00 AM – 9:00 PM IST, all days",
  cutoff: "Most editions close around 5:00–6:00 PM for next-day print",
  tagline: "Book newspaper ads in print — clear rates, every city.",
} as const;

export const AD_TYPES = [
  {
    slug: "text-classified",
    name: "Text classified",
    badge: "Most economical",
    short: "Cheapest — just words",
    description:
      "A few lines of plain text. What most name-change, matrimonial, and notice ads use. Charged per line or word.",
    fromPrice: 360,
    image: "/ads/text-classified.gif",
    bestFor: ["Change of Name", "Matrimonial", "Lost & Found", "Court notices"],
  },
  {
    slug: "classified-display",
    name: "Classified display",
    badge: "Value for money",
    short: "Words with a logo or photo",
    description:
      "A boxed ad with your logo, photograph, or custom font — stands out in the classified columns. Charged per sq. cm.",
    fromPrice: 1200,
    image: "/ads/classified-display.gif",
    bestFor: ["Property", "Vehicles", "Business", "Recruitment"],
  },
  {
    slug: "display",
    name: "Display ad",
    badge: "Brand campaigns",
    short: "Large, designed, premium",
    description:
      "Runs on the main pages beside the news. Custom size, page preference, and colour. Negotiated rates.",
    fromPrice: 5000,
    image: "/ads/display-main.gif",
    bestFor: ["Brand launches", "Recruitment drives", "Retail campaigns"],
  },
] as const;

export type AdType = (typeof AD_TYPES)[number];

export function getAdType(slug: string) {
  return AD_TYPES.find((t) => t.slug === slug);
}
