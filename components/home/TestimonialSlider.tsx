"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/lib/content";

const AUTOPLAY_MS = 4000;
const SLIDES = [...TESTIMONIALS, ...TESTIMONIALS];

export function TestimonialSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const stepSize = useCallback(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return 0;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.offsetWidth + gap;
  }, []);

  // The second copy of the list is identical, so jumping back by one full
  // copy while scrolling is invisible and keeps the loop endless.
  const move = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      const step = stepSize();
      if (!track || !step) return;

      const loop = step * TESTIMONIALS.length;
      if (direction === 1 && track.scrollLeft >= loop - step / 2) {
        track.scrollLeft -= loop;
      } else if (direction === -1 && track.scrollLeft <= step / 2) {
        track.scrollLeft += loop;
      }
      track.scrollBy({ left: direction * step, behavior: "smooth" });
    },
    [stepSize],
  );

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const step = stepSize();
      if (!track || !step) return;
      const loop = step * TESTIMONIALS.length;
      const base = Math.floor(track.scrollLeft / loop) * loop;
      track.scrollTo({ left: base + index * step, behavior: "smooth" });
    },
    [stepSize],
  );

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => move(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, move]);

  function onScroll() {
    const track = trackRef.current;
    const step = stepSize();
    if (!track || !step) return;
    setActive(Math.round(track.scrollLeft / step) % TESTIMONIALS.length);
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        aria-live="off"
      >
        {SLIDES.map((item, index) => (
          <article
            key={`${item.name}-${index}`}
            aria-hidden={index >= TESTIMONIALS.length}
            className="flex w-[86%] shrink-0 snap-start flex-col border border-line bg-white p-6 sm:w-[calc(50%-0.625rem)] sm:p-7 lg:w-[calc(33.333%-0.834rem)]"
          >
            <div className="flex items-center gap-1 text-maroon" aria-label={`${item.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, star) => (
                <span key={star} className={star < item.rating ? "" : "text-line"}>
                  ★
                </span>
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal sm:text-base">
              &ldquo;{item.text}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3.5 border-t border-line pt-5">
              <Image
                src={item.image}
                alt={item.name}
                width={96}
                height={96}
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-display text-base text-ink">{item.name}</p>
                <p className="truncate text-xs text-charcoal">
                  {item.category} · {item.city}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Go to review ${index + 1}`}
              aria-current={active === index}
              onClick={() => goTo(index)}
              className={`h-1.5 transition-all ${
                active === index ? "w-7 bg-maroon" : "w-3 bg-line hover:bg-charcoal/40"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => move(-1)}
            className="flex h-10 w-10 items-center justify-center border border-line bg-white text-ink transition hover:border-maroon hover:text-maroon"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => move(1)}
            className="flex h-10 w-10 items-center justify-center border border-line bg-white text-ink transition hover:border-maroon hover:text-maroon"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
