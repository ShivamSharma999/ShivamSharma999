import { gsap } from "./gsap";

const tilt = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget,
    r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5,
    py = (e.clientY - r.top) / r.height - 0.5;
  gsap.to(el, {
    rotateY: px * 10,
    rotateX: -py * 10,
    transformPerspective: 900,
    duration: 0.5,
    ease: "power2.out",
  });
};
const untilt = (e: React.PointerEvent<HTMLElement>) =>
  gsap.to(e.currentTarget, {
    rotateY: 0,
    rotateX: 0,
    duration: 0.8,
    ease: "elastic.out(1,.5)",
  });
export { tilt, untilt };
