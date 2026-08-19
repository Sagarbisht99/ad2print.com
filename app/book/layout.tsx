import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Contact AD2PRINT to book a newspaper classified or display ad.",
  path: "/book",
  noIndex: true,
});

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
