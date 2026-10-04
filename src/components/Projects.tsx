"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Lordicon from "./Lordicon";
import { PROJECTS } from "@/data/content";
import { gsap, prefersReducedMotion } from "@/utils/gsap";
import { tilt, untilt } from "@/utils/tilt";

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const el = track.current!;
      const dist = () => el.scrollWidth - window.innerWidth + 96;
      gsap.to(el, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: ".p-pin",
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      gsap.to(".p-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".p-pin",
          start: "top top",
          end: () => `+=${dist()}`,
          scrub: true,
        },
      });
    });
    mm.add("(max-width: 1023px)", () => {
      gsap.utils
        .toArray<HTMLElement>(".p-card")
        .forEach((c) =>
          gsap.from(c, {
            y: 70,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: c, start: "top 88%" },
          }),
        );
    });
    return () => mm.revert();
  }, []);
  return (
    <section id="projects" ref={root}>
      <div className="p-pin flex min-h-svh flex-col justify-center py-4 overflow-hidden lg:h-svh lg:py-0">
        <div className="mx-auto mb-10 flex w-full max-w-6xl items-end justify-between px-6">
          <h2 className="font-display text-5xl font-extrabold md:text-7xl">
            Featured <span className="stroke-text">projects</span>
          </h2>
          <div className="hidden h-1 w-40 overflow-hidden rounded bg-white/10 lg:block">
            <div className="p-bar h-full origin-left scale-x-0 bg-saffron" />
          </div>
        </div>
        <div
          ref={track}
          className="flex flex-col gap-8 px-6 lg:w-max lg:flex-row pb-5 pt-5 lg:gap-10 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              data-hover
              className="p-card relative flex h-125 shrink-0 flex-col overflow-hidden rounded-4xl border border-white/10 bg-ink-2 lg:w-[min(50vw,500px)]"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={p.image}
                  alt={`Preview of ${p.title}`}
                  fill
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-2 via-transparent to-transparent" />
                <span
                  className="font-display stroke-text absolute right-6 top-2 text-8xl font-extrabold"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-7">
                <h3 className="font-display text-3xl font-bold">{p.title}</h3>
                <p className="leading-relaxed text-ivory/70">{p.description}</p>
                <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                  {p.terms.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-ivory/75"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex gap-3 pt-2">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${p.title} live site`}
                    className="flex items-center gap-1 rounded-full bg-saffron px-5 py-2 text-sm font-semibold text-ink"
                  >
                    Live{" "}
                    <Lordicon
                      src="globe"
                      target="parent"
                      size={24}
                      colors="primary:#070b1a,secondary:#070b1a"
                    />
                  </a>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${p.title} source code`}
                    className="flex items-center gap-1 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold"
                  >
                    Source <Lordicon src="github" target="parent" size={24} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
