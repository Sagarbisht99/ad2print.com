"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "at the lowest cost!",
  "in 280+ newspapers!",
  "in any language!",
  "with proof of print!",
];

export function HeroTypewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const phrase = PHRASES[index];
    const speed = deleting ? 38 : 72;
    const pause = deleting && text === "" ? 280 : !deleting && text === phrase ? 1600 : speed;

    const timer = window.setTimeout(() => {
      if (!deleting && text === phrase) {
        setDeleting(true);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % PHRASES.length);
        return;
      }
      setText((prev) =>
        deleting ? phrase.slice(0, prev.length - 1) : phrase.slice(0, prev.length + 1),
      );
    }, pause);

    return () => window.clearTimeout(timer);
  }, [text, deleting, index, reduced]);

  const display = reduced ? PHRASES[0] : text;

  return (
    <span className="text-maroon" aria-live="polite">
      {display}
      <span className="hero-caret ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.08em] bg-maroon align-baseline" />
    </span>
  );
}
