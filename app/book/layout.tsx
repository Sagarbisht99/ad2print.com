import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Ad",
  description: "Book a newspaper classified or display ad with AD2PRINT — live estimate, proof before print.",
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
