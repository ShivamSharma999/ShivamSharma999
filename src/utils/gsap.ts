import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined")
  gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Run fn once the preloader has finished (or immediately if it already has). */
export function whenReady(fn: () => void) {
  function run() {
    setTimeout(() => {
      if (document.readyState === "complete") fn();
      else window.addEventListener("load", fn, { once: true });
    }, 500);
  }
  const w = window as unknown as { __appReady?: boolean };
  if (w.__appReady) {
    run();
    return () => {};
  }
  window.addEventListener("app:ready", run, { once: true });
  return () => window.removeEventListener("app:ready", run);
}

export { gsap, ScrollTrigger, SplitText };
