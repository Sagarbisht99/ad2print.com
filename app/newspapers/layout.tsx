import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newspapers",
  description: "Browse national and regional newspapers to book classified and display ads with AD2PRINT.",
};

export default function NewspapersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
