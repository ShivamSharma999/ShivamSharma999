"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { NAV } from "@/data/content";
import { gsap, ScrollTrigger, whenReady } from "@/utils/gsap";

export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const off = whenReady(() =>
      gsap.from("#navbar", {
        yPercent: -120,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
      }),
    );
    const triggers = NAV.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (s) => s.isActive && setActive(id),
      }),
    );
    return () => {
      off();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const click = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    goTo(id);
  };

  return (
    <header id="navbar" className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-ink/60 px-5 py-2.5 backdrop-blur-xl">
        <a
          href="#home"
          onClick={(e) => click(e, "home")}
          className="font-display flex items-center gap-2 text-lg font-bold"
          aria-label="Shivam Sharma, home"
        >
          <Image
            src="/assets/logo.png"
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />{" "}
          Shivam
        </a>
        <nav
          aria-label="Primary"
          className={`${open ? "flex" : "hidden"} absolute left-4 right-4 top-[68px] flex-col gap-1 rounded-3xl border border-white/10 bg-ink/95 p-4 backdrop-blur-xl md:static md:flex md:flex-row md:border-0 md:bg-transparent md:p-0`}
        >
          {NAV.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => click(e, id)}
              aria-current={active === id ? "true" : undefined}
              className={`rounded-full px-4 py-2 text-sm capitalize transition-colors ${active === id ? "bg-saffron text-ink font-semibold" : "text-ivory/70 hover:text-ivory"}`}
            >
              {id}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-6 bg-ivory" />
          <span className="mt-1.5 block h-0.5 w-4 bg-ivory" />
        </button>
      </div>
    </header>
  );
}
