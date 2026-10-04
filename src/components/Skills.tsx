"use client";
import { useEffect, useRef } from "react";
import Lordicon from "./Lordicon";
import { SKILLS } from "@/data/content";
import { gsap, prefersReducedMotion } from "@/utils/gsap";
import { tilt, untilt } from "@/utils/tilt";

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".s-card", {
        y: 80,
        opacity: 0,
        rotateX: -25,
        transformPerspective: 800,
        stagger: { each: 0.08, grid: "auto", from: "start" },
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".s-grid", start: "top 80%" },
      });
      gsap.utils.toArray<HTMLElement>(".s-card").forEach((card) => {
        const level = Number(card.dataset.level),
          fill = card.querySelector<HTMLElement>(".s-fill"),
          val = card.querySelector<HTMLElement>(".s-val");
        const o = { v: 0 };
        if (fill) fill.style.width = "0%";
        gsap.to(o, {
          v: level,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
          onUpdate: () => {
            if (val) val.textContent = `${Math.round(o.v)}%`;
            if (fill) fill.style.width = `${o.v}%`;
          },
        });
      });
      gsap.to(".s-title", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".s-title", start: "top 85%", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={root} className="mx-auto max-w-6xl px-6 py-32">
      <h2 className="font-display mb-14 text-5xl font-extrabold md:text-7xl s-title">
        Skills <span className="stroke-text">&amp; craft</span>
      </h2>
      <div className="s-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((s) => (
          <article
            key={s.name}
            data-level={s.level}
            data-hover
            onPointerMove={tilt}
            onPointerLeave={untilt}
            className="s-card group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-7 transition-colors hover:border-saffron/60"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-lg font-bold text-saffron">
              {"icon" in s && s.icon ? (
                <Lordicon src={s.icon} target="parent*2" speed={2} size={38} />
              ) : (
                <span className="font-display">{s.mono}</span>
              )}
            </div>
            <h3 className="font-display text-2xl font-bold">{s.name}</h3>
            <p className="mt-2 min-h-14 text-sm leading-relaxed text-ivory/65">
              {s.text}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label={`${s.name} proficiency`}
                aria-valuenow={s.level}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="s-fill block h-full rounded-full bg-linear-to-r from-saffron via-lotus to-indigo" />
              </div>
              <span className="s-val w-10 text-right text-sm tabular-nums text-ivory/70">
                {s.level}%
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
