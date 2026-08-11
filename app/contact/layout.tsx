import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the AD2PRINT booking desk by phone, WhatsApp, or email.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
