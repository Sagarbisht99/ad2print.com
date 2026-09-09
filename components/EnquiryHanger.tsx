"use client";

import Link from "next/link";

const BEADS = [
  { top: 0, size: 13 },
  { top: 17, size: 12 },
  { top: 33, size: 11 },
];

export function EnquiryHanger({ className }: { className?: string }) {
  return (
    <Link
      href="/contact"
      aria-label="Enquiry now"
      className={`pointer-events-auto block ${className ?? ""}`}
    >
      <div className="flex flex-col items-center">
        <div className="relative h-12 w-4">
          <span
            className="absolute left-1/2 top-1 h-11 w-0.5 -translate-x-1/2 rounded-full"
            style={{
              background: "linear-gradient(180deg, #c9ccd2 0%, #e6e8ec 50%, #c9ccd2 100%)",
            }}
            aria-hidden
          />
          {BEADS.map((bead) => (
            <span
              key={bead.top}
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={{
                top: bead.top,
                height: bead.size,
                width: bead.size,
                background:
                  "radial-gradient(circle at 32% 28%, #ffffff 0%, #eceef1 38%, #c3c7ce 72%, #a9aeb6 100%)",
                boxShadow: "0 2px 4px rgba(26,27,30,0.22)",
              }}
              aria-hidden
            />
          ))}
        </div>

        <div
          className="animate-hanger-swing relative w-full select-none rounded-xl px-3 py-3 text-center"
          style={{
            background: "linear-gradient(180deg, #e0405a 0%, #c8203c 100%)",
            border: "1.5px solid rgba(255,255,255,0.35)",
            boxShadow: "0 16px 28px rgba(178,31,45,0.28)",
          }}
        >
          <span className="absolute left-1.5 top-1 text-[9px] font-bold text-white/60" aria-hidden>
            +
          </span>
          <span className="absolute right-1.5 top-1 text-[9px] font-bold text-white/60" aria-hidden>
            +
          </span>
          <span
            className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white/60"
            aria-hidden
          >
            +
          </span>
          <span
            className="absolute bottom-1 right-1.5 text-[9px] font-bold text-white/60"
            aria-hidden
          >
            +
          </span>

          <span className="block text-[11px] font-extrabold leading-none tracking-[0.16em] text-white">
            ENQUIRY
          </span>
          <span className="mt-1.5 block text-[13px] font-extrabold leading-none tracking-[0.14em] text-white">
            NOW
          </span>
        </div>
      </div>
    </Link>
  );
}
