import Link from "next/link";

const STEPS = ["Choose city", "Choose newspaper", "Fill details"];

export function BookingSteps({
  current,
  citySlug,
}: {
  current: 1 | 2 | 3;
  citySlug?: string;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.08em] text-charcoal sm:text-[13px]">
      {STEPS.map((label, index) => {
        const step = (index + 1) as 1 | 2 | 3;
        const active = step === current;
        const done = step < current;
        const className = active ? "text-maroon" : done ? "text-ink" : "";

        return (
          <li key={label} className="flex items-center gap-2">
            {index > 0 ? <span className="text-maroon">›</span> : null}
            {step === 1 ? (
              <Link href="/name-change#cities" className={className}>
                {step}. {label}
              </Link>
            ) : step === 2 && citySlug && current === 3 ? (
              <Link href={`/name-change/${citySlug}`} className={className}>
                {step}. {label}
              </Link>
            ) : (
              <span className={className}>
                {step}. {label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
