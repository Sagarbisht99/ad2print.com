import { redirect } from "next/navigation";

/**
 * Booking for this category happens over the enquiry popup, not online
 * payment — /book kept as a redirect for old links and bookmarks.
 */
export default function PropertyBookRedirect() {
  redirect("/property");
}
