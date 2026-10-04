"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Lordicon from "./Lordicon";
import { goTo } from "./Navbar";
import { gsap, SplitText, whenReady, prefersReducedMotion } from "@/utils/gsap";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      gsap.set(".h-fade", { opacity: 0, y: 30 });
      gsap.set(".h-canvas", { opacity: 0 });
      split = new SplitText(".h-name", { type: "chars" });
      gsap.set(split.chars, { yPercent: 120, rotate: 8 });
      const fn = () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(".h-canvas", { opacity: 1, duration: 2 })
          .to(
            split!.chars,
            { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.05 },
            0.1,
          )
          .to(".h-fade", { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.6);
      }
      const off = whenReady(fn);
      gsap.to(".h-content", {
        yPercent: -18,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      return off;
    }, root);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={root}
      className="relative flex min-h-svh items-end overflow-hidden pb-20 pt-32"
    >
      <div className="h-canvas absolute inset-0">
        <Scene3D />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(7,11,26,.9),transparent_60%)]" />
      <div className="h-content relative mx-auto w-full max-w-6xl px-6">
        <p className="h-fade mb-4 text-ivory/70">
          Full-stack developer · Rajasthan, India
        </p>
        <h1
          aria-label="Shivam Sharma"
          className="font-display text-[clamp(3.6rem,13vw,10.5rem)] font-extrabold leading-[0.9] tracking-tight"
        >
          <span className="mask pb-2">
            <span className="h-name block">Shivam</span>
          </span>
          <span className="mask pb-2">
            <span className="h-name stroke-text block">Sharma</span>
          </span>
        </h1>
        <p className="h-fade mt-6 max-w-lg text-lg leading-relaxed text-ivory/75">
          I build thoughtful web experiences, desktop tools and AI-powered
          products, with a strong eye for interface design, interaction and
          performance.
        </p>
        <div className="h-fade mt-9 flex flex-wrap gap-4">
          <a
            href="#projects"
            data-magnetic
            onClick={(e) => {
              e.preventDefault();
              goTo("projects");
            }}
            className="flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 font-semibold text-ink"
          >
            View my work{" "}
            <Lordicon
              src="arrow"
              target="parent"
              size={26}
              colors="primary:#070b1a,secondary:#070b1a"
            />
          </a>
          <a
            href="#contact"
            data-magnetic
            onClick={(e) => {
              e.preventDefault();
              goTo("contact");
            }}
            className="rounded-full border border-white/25 px-7 py-3.5 font-semibold transition-colors hover:border-saffron hover:text-saffron"
          >
            Let&apos;s connect
          </a>
        </div>
      </div>
    </section>
  );
}
