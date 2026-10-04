"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { ABOUT } from "@/data/content";
import {
  gsap,
  SplitText,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/utils/gsap";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const lead = new SplitText(".a-lead", { type: "words" });
      splits.push(lead);
      gsap.fromTo(
        lead.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ".a-lead",
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".a-photo",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".a-photo", start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".a-photo img",
        { scale: 1.35 },
        {
          scale: 0.8,
          ease: "none",
          scrollTrigger: {
            trigger: ".a-photo",
            start: "top bottom",
            end: "50% top",
            scrub: true,
          },
        },
      );
      gsap.from(".a-rest p", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".a-rest", start: "top 85%" },
      });
    }, root);
    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
      ScrollTrigger.refresh(true);
    };
  }, []);

  return (
    <section id="about" ref={root} className="mx-auto max-w-6xl px-6 py-32">
      <h2 className="font-display mb-10 text-lg text-saffron">About me</h2>
      <p className="a-lead font-display max-w-4xl text-3xl font-semibold leading-tight md:text-5xl">
        {ABOUT[0]}
      </p>
      <div className="mt-20 grid items-start gap-12 md:grid-cols-[minmax(0,380px)_1fr]">
        <div className="a-photo relative aspect-4/5 overflow-hidden rounded-4xl">
          <Image
            src="/assets/shivam.jpg"
            alt="Portrait of Shivam Sharma"
            fill
            sizes="(min-width:768px) 380px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="a-rest space-y-6 text-lg leading-relaxed text-ivory/75 md:pt-10">
          {ABOUT.slice(1).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
