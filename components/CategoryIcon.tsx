import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  name: (
    <path d="M8 14h8M10 8h4v2a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V8ZM7 18h10" />
  ),
  heart: <path d="M12 19s-7-4.5-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.5-7 9-7 9Z" />,
  home: <path d="M4 11.5 12 5l8 6.5V20H4v-8.5ZM10 20v-6h4v6" />,
  car: (
    <path d="M5 15h14l-1.2-4.2A2 2 0 0 0 15.9 9.5H8.1a2 2 0 0 0-1.9 1.3L5 15Zm0 0v2.5M19 15v2.5M7.5 17.5h.01M16.5 17.5h.01" />
  ),
  briefcase: <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 10h16v9H4v-9Zm0 4h16" />,
  bag: <path d="M7 8h10l1 12H6L7 8Zm3 0V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />,
  candle: <path d="M12 4v3M10 21h4a2 2 0 0 0 2-2v-6H8v6a2 2 0 0 0 2 2Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  scale: <path d="M12 4v16M6 8h12M7 8l-3 6h6L7 8Zm10 0-3 6h6l-3-6Z" />,
  book: <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z" />,
  megaphone: <path d="M4 11v2a2 2 0 0 0 2 2h1l4 4V5L7 9H6a2 2 0 0 0-2 2Zm11-1a4 4 0 0 1 0 6" />,
  doc: <path d="M8 4h7l3 3v13H8V4Zm7 0v3h3M10 12h6M10 16h6" />,
};

export function CategoryIcon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {icons[name] ?? icons.doc}
    </svg>
  );
}
