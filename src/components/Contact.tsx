"use client";
import { useEffect, useRef, useState } from "react";
import Lordicon from "./Lordicon";
import { SITE } from "@/data/content";
import { gsap, SplitText, prefersReducedMotion } from "@/utils/gsap";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = new SplitText(".c-title", { type: "chars" });
      gsap.from(split.chars, { yPercent: 110, opacity: 0, stagger: 0.03, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".c-title", start: "top 85%" } });
      gsap.from(".c-fade", { y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".c-grid", start: "top 85%" } });
    }, root);
    return () => { split?.revert(); ctx.revert(); };
  }, []);

  // No backend needed: opens the visitor's mail client with the message prefilled.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `${f.get("message")}\n\n${f.get("name")} (${f.get("email")})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(String(f.get("subject")))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const field = "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 outline-none transition-colors placeholder:text-ivory/35 focus:border-saffron";

  return (
    <section id="contact" ref={root} className="mx-auto max-w-6xl px-6 py-32">
      <h2 className="c-title font-display mask text-[clamp(3rem,10vw,8rem)] font-extrabold leading-none">Get in touch</h2>
      <p className="mt-6 max-w-xl text-lg text-ivory/70">I like building things that are useful, expressive, and easy to use. Reach out if you want to collaborate or explore an idea together.</p>
      <div className="c-grid mt-16 grid gap-12 lg:grid-cols-2">
        <div className="c-fade space-y-6">
          {[{ i: "location", t: SITE.location }, { i: "email", t: SITE.email, h: `mailto:${SITE.email}` }, { i: "call", t: SITE.phone, h: `tel:${SITE.phone.replace(/\s/g, "")}` }].map((r) => (
            <p key={r.i} className="flex items-center gap-4 text-lg">
              <Lordicon src={r.i} size={40} stroke={3} />
              {r.h ? <a href={r.h} data-magnetic className="hover:text-saffron">{r.t}</a> : r.t}
            </p>
          ))}
          <div className="flex gap-3 pt-4">
            {SITE.socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} data-magnetic
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-saffron hover:bg-saffron/10">
                <Lordicon src={s.icon} size={32} stroke={3} target="parent" />
              </a>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="c-fade space-y-4">
          <input className={field} name="name" required placeholder="Your name" aria-label="Name" autoComplete="name" />
          <input className={field} name="email" type="email" required placeholder="Your email" aria-label="Email" autoComplete="email" />
          <input className={field} name="subject" required placeholder="Subject" aria-label="Subject" />
          <textarea className={`${field} min-h-36`} name="message" required placeholder="Your message" aria-label="Message" />
          <button type="submit" data-magnetic className="flex items-center gap-2 rounded-full bg-saffron px-8 py-3.5 font-semibold text-ink">
            {sent ? "Opening your mail app…" : "Send message"} <Lordicon src="plane" target="parent" size={26} colors="primary:#070b1a,secondary:#070b1a" />
          </button>
        </form>
      </div>
    </section>
  );
}
