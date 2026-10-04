import { MARQUEE } from "@/data/content";
export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-white/10 py-6">
      <div className="marquee-track flex w-max gap-12">
        {items.concat(items).map((t, i) => (
          <span key={i} className={`font-display text-4xl font-bold md:text-6xl ${i % 2 ? "stroke-text" : ""}`}>{t}<span className="ml-12 text-saffron">✦</span></span>
        ))}
      </div>
    </div>
  );
}
