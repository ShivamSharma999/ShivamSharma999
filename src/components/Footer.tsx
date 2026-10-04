import { SITE } from "@/data/content";
export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-ivory/55">
      © {new Date().getFullYear()} {SITE.name}. Built with Next.js, GSAP &amp; Three.js.
    </footer>
  );
}
