"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const w = window as unknown as { __appReady?: boolean };
    document.documentElement.style.overflow = "hidden";
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            w.__appReady = true;
            globalThis.dispatchEvent?.(new Event("app:ready"));
            if (root.current) root.current.style.display = "none";
          },
        })
        .to(counter, {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num.current)
              num.current.textContent = String(Math.round(counter.v));
            if (bar.current)
              bar.current.style.transform = `scaleX(${counter.v / 100})`;
          },
        })
        .to(".pre-word", {
          yPercent: -110,
          duration: 0.6,
          ease: "power3.in",
          stagger: 0.05,
        })
        .to(
          root.current,
          { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" },
          "-=0.2",
        );
    }, root);
    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-ink"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="font-display flex gap-4 text-5xl font-extrabold md:text-8xl">
        {["Shivam", "Sharma"].map((w) => (
          <span key={w} className="mask">
            <span className="pre-word inline-block">{w}</span>
          </span>
        ))}
      </div>
      <div className="mt-10 h-px w-56 bg-white/15">
        <span
          ref={bar}
          className="block h-px origin-left bg-saffron"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <span ref={num} className="mt-4 text-sm tabular-nums text-ivory/60">
        0
      </span>
    </div>
  );
}
