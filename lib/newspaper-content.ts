import { getNewspapers, type Newspaper } from "@/lib/data";

export const LANGUAGE_LABELS: Record<string, string> = {
  English: "English",
  Hindi: "हिन्दी",
  Marathi: "मराठी",
  Bengali: "বাংলা",
  Gujarati: "ગુજરાતી",
  Assamese: "অসমীয়া",
  Telugu: "తెలుగు",
  Urdu: "اردو",
  Odia: "ଓଡ଼ିଆ",
  Malayalam: "മലയാളം",
  Tamil: "தமிழ்",
  Punjabi: "ਪੰਜਾਬੀ",
  Kannada: "ಕನ್ನಡ",
  Khasi: "Khasi",
  Mizo: "Mizo",
};

export const LANGUAGE_NOTES: Record<string, string> = {
  English:
    "English dailies carry national reach and are widely accepted for passport, bank, company and legal notices. They are also the usual choice when an authority asks for an English-language publication.",
  Hindi:
    "Hindi newspapers reach the widest reader base across North and Central India. They are often the better choice for matrimonial, property, recruitment and local public notices.",
  Marathi:
    "Marathi dailies are strong in Mumbai, Pune and the rest of Maharashtra. A regional-language notice here often reaches local families, buyers and readers more directly than an English-only run.",
  Bengali:
    "Bengali dailies dominate Kolkata and much of West Bengal. They work well for matrimonial, property, education and statutory notices where the audience reads in Bengali.",
  Gujarati:
    "Gujarati newspapers connect with readers across Gujarat and Gujarati-speaking business communities. They are commonly used for property, share, auction and matrimonial notices.",
  Assamese:
    "Assamese dailies serve readers across Assam and the North-East. A regional-language notice is often required when the matter relates to a local court, registrar or municipal authority.",
  Telugu:
    "Telugu newspapers reach readers across Telangana and Andhra Pradesh. They are effective for property, matrimonial, recruitment and public notices in Hyderabad, Vijayawada and smaller cities.",
  Urdu:
    "Urdu dailies reach a dedicated readership in several states. They are often used for personal, matrimonial and legal notices where the family or authority prefers Urdu.",
  Odia:
    "Odia newspapers serve readers across Odisha. They are a practical choice for local property, education and public notices in Bhubaneswar, Cuttack and district towns.",
  Malayalam:
    "Malayalam dailies cover Kerala and Malayalam-speaking readers elsewhere. They suit matrimonial, property, education and statutory notices with a strong local audience.",
  Tamil:
    "Tamil newspapers reach readers across Tamil Nadu and beyond. They are widely used for matrimonial, property, recruitment and court notices in Chennai, Coimbatore and other cities.",
  Punjabi:
    "Punjabi dailies serve Punjab and Punjabi-speaking readers. They work well for matrimonial, property, education and local announcements.",
  Kannada:
    "Kannada newspapers cover Karnataka and are a strong choice for Bengaluru, Mysore and district-level property, matrimonial and public notices.",
  Khasi:
    "Khasi publications serve readers in Meghalaya. They are useful when a notice needs local circulation in Shillong or nearby districts.",
  Mizo:
    "Mizo publications serve readers in Mizoram. They are appropriate for local public notices and announcements where Mizo is the preferred language.",
};

const AD_TYPE_LABELS: Record<string, string> = {
  "text-classified": "Text classified",
  "classified-display": "Classified display",
  display: "Main-page display",
};

export function getLanguageLabel(language: string) {
  return LANGUAGE_LABELS[language] ?? language;
}

export function getLanguageNote(language: string) {
  return (
    LANGUAGE_NOTES[language] ??
    `${language} publications reach readers who prefer that language. A regional-language ad can be more effective than an English-only booking for local notices.`
  );
}

export function getAdTypeLabel(slug: string) {
  return AD_TYPE_LABELS[slug] ?? slug;
}

export function getAdTypesForPaper(paper: Newspaper) {
  return paper.adTypes.map((type) => ({
    slug: type,
    name: getAdTypeLabel(type),
  }));
}

export function getNewspaperMetaTitle(paper: Newspaper) {
  return `${paper.name} Ad Booking & Rates`;
}

export function getNewspaperMetaDescription(paper: Newspaper) {
  const cities = paper.cities.slice(0, 3).join(", ");
  return `Book classified or display ads in ${paper.name} (${paper.language}, ${paper.region}). ${paper.cities.length} editions incl. ${cities}. Free drafting, e-paper proof.`;
}

export function getNewspaperFaqs(paper: Newspaper) {
  const cityList = paper.cities.slice(0, 6).join(", ");
  return [
    {
      q: `How much does a ${paper.name} newspaper ad cost?`,
      a: `The rate depends on the ad format, the ${paper.region.toLowerCase()} edition, the size or line count, and the publication day. Tell the desk the edition and the wording and we will confirm the live rate including GST before you pay.`,
    },
    {
      q: `Which cities have a ${paper.name} edition?`,
      a: `We currently list ${paper.cities.length} ${paper.cities.length === 1 ? "edition" : "editions"} for ${paper.name}, including ${cityList}${
        paper.cities.length > 6 ? " and more" : ""
      }. Send your city if you cannot see it and the desk will confirm availability.`,
    },
    {
      q: `Can a ${paper.name} ad run tomorrow?`,
      a: `Most editions can accept a classified ad confirmed before the publication cut-off, usually around 5 PM the previous day. Weekend and premium editions have earlier deadlines, so confirm the exact date with the desk first.`,
    },
    {
      q: `What ad formats can I book in ${paper.name}?`,
      a: `${paper.name} accepts ${getAdTypesForPaper(paper)
        .map((type) => type.name.toLowerCase())
        .join(", ")}. Text classifieds are the most economical; classified display and main-page display support logos, photographs and larger artwork.`,
    },
    {
      q: `Is drafting available in ${paper.language}?`,
      a: `Yes. The desk can draft or translate your matter into ${paper.language} and fit it to ${paper.name}'s column width before sending a proof for your approval.`,
    },
    {
      q: `Will I get proof after publication?`,
      a: `Yes. After the ad prints, we send the e-paper page for the correct date and edition, along with the GST invoice. A physical cutting can be arranged on request.`,
    },
  ];
}

export function getPopularNewspapers(limit = 16) {
  const order = [
    "times-of-india",
    "the-hindu",
    "hindustan-times",
    "telegraph",
    "indian-express",
    "mirror",
    "tribune",
    "deccan-chronicle",
    "economic-times",
    "new-indian-express",
    "deccan-herald",
    "daily-excelsior",
    "assam-tribune",
    "financial-express",
    "telangana-today",
    "free-press-journal",
  ];
  const bySlug = new Map(getNewspapers().map((paper) => [paper.slug, paper]));
  return order
    .map((slug) => bySlug.get(slug))
    .filter((paper): paper is Newspaper => Boolean(paper))
    .slice(0, limit);
}

export function getLanguageCounts() {
  const counts = new Map<string, number>();
  for (const paper of getNewspapers()) {
    counts.set(paper.language, (counts.get(paper.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));
}
