"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function CategoryCityHint({ categoryName }: { categoryName: string }) {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");

  if (!city) return null;

  return (
    <div className="mt-6 rounded-xl border border-maroon/20 bg-maroon/[0.04] px-4 py-3 text-sm text-charcoal">
      You started a <span className="font-semibold text-ink">{categoryName}</span> booking for{" "}
      <span className="font-semibold text-ink">{city.replace(/-/g, " ")}</span>. Confirm the city
      edition with the desk, or{" "}
      <Link
        href={`/newspapers?q=${encodeURIComponent(city.replace(/-/g, " "))}`}
        className="font-semibold text-maroon hover:underline"
      >
        see newspapers for this city
      </Link>
      .
    </div>
  );
}
