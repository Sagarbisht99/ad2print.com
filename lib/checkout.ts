import { getNameChangeSelection } from "@/lib/data";

export type CheckoutBooking = {
  city: string;
  paperSlugs: string[];
  label: string;
  unit: string;
  /** Package rate in rupees, as shown on the newspaper picker. */
  rate: number;
};

/**
 * Rebuilds the selected newspaper package on the server so the payable amount
 * always comes from our own data and never from the client.
 */
export function resolveCheckoutBooking(
  city: string | undefined,
  papers: string | string[] | undefined,
): CheckoutBooking | null {
  const cityName = city?.trim();
  if (!cityName) return null;

  const slugs = (Array.isArray(papers) ? papers : (papers ?? "").split(","))
    .map((slug) => slug.trim())
    .filter(Boolean);

  if (slugs.length === 0) return null;

  const selection = getNameChangeSelection(slugs, cityName);
  if (!selection || !selection.rate || selection.rate <= 0) return null;

  return {
    city: cityName,
    paperSlugs: selection.papers.map((paper) => paper.slug),
    label: selection.label,
    unit: selection.unit,
    rate: selection.rate,
  };
}
