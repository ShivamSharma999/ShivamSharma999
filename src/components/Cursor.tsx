"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.1 }), dy = gsap.quickTo(dot.current, "y", { duration: 0.1 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = (e.target as HTMLElement).closest("a,button,[data-hover]");
      gsap.to(ring.current, { scale: t ? 2.4 : 1, backgroundColor: t ? "rgba(255,159,67,.18)" : "rgba(255,159,67,0)", duration: 0.3 });
      // magnetic pull
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (d < 120) gsap.to(el, { x: (e.clientX - cx) * 0.3, y: (e.clientY - cy) * 0.3, duration: 0.4 });
        else gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" });
      });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor-el pointer-events-none fixed left-0 top-0 z-[90] -ml-5 -mt-5 h-10 w-10 rounded-full border border-saffron/70" />
      <div ref={dot} aria-hidden="true" className="cursor-el pointer-events-none fixed left-0 top-0 z-[90] -ml-1 -mt-1 h-2 w-2 rounded-full bg-saffron" />
    </>
  );
}
