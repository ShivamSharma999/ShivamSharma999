import * as data from './constants.js';

const $ = (selector) => document.querySelector(selector),
    loading = $('#preloader'),
    typeWriter = $('.type-writer'),
    projectsGrid = $('#projects .project-grid'),
    skillsContainer = $('.skills-container'),
    isMobile = window.innerWidth < 768;

/* ---------------------------------------------------------------------
   Feature detection. Everything animated below is optional sugar layered
   on top of a page that already works without JavaScript. If a CDN
   script fails to load (or the visitor has prefers-reduced-motion set),
   these flags quietly turn the relevant enhancement off instead of
   throwing errors or leaving the page in a half-hidden state.
   --------------------------------------------------------------------- */
const hasGSAP = typeof gsap !== 'undefined';
const hasScrollTrigger = hasGSAP && typeof ScrollTrigger !== 'undefined';
const hasSplitText = hasGSAP && typeof SplitText !== 'undefined';
const hasLenis = typeof Lenis !== 'undefined';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const motionEnabled = hasGSAP && !prefersReducedMotion;
const heroTasks = [];

if (hasGSAP) {
    const plugins = [];
    if (hasScrollTrigger) plugins.push(ScrollTrigger);
    if (hasSplitText) plugins.push(SplitText);
    if (plugins.length) gsap.registerPlugin(...plugins);
}

let lenis = null;

function safe(fn, label) {
    try {
        fn();
    } catch (err) {
        console.warn(`[portfolio] ${label} failed, continuing without it:`, err);
    }
}

/* ---------------------------------------------------------------------
   Preloader: counts up to ~92% while the page loads, then snaps to 100%
   and slides away once window "load" actually fires. Falls back to a
   simple fade if GSAP didn't load or the visitor prefers reduced motion.
   --------------------------------------------------------------------- */
function runPreloader() {
    if (!loading) return Promise.resolve();

    const fill = loading.querySelector('.preloader-bar-fill');
    const percentEl = loading.querySelector('.preloader-percent');
    const setPercent = (v) => {
        const rounded = Math.round(v);
        if (percentEl) percentEl.textContent = rounded + '%';
        if (fill) fill.style.width = rounded + '%';
    };

    return new Promise((resolve) => {
        const finish = () => {
            const done = () => {
                heroTasks.forEach(task => task());
                setTimeout(() => loading.remove(), 700);
                resolve();
            };
            if (motionEnabled) {
                gsap.to(loading, { yPercent: -100, duration: 0.7, ease: 'power3.inOut', onComplete: done });
            } else {
                loading.style.transition = 'transform 0.4s ease';
                loading.style.transform = 'translateY(-100%)';
                setTimeout(done, 500);
            }
        };

        if (!motionEnabled) {
            if (document.readyState === 'complete') finish();
            else window.addEventListener('load', finish, { once: true });
            return;
        }

        const counter = { val: 0 };
        const introTween = gsap.to(counter, {
            val: 92,
            duration: 2.4,
            ease: 'power1.out',
            onUpdate: () => setPercent(counter.val)
        });

        const onLoaded = () => {
            introTween.kill();
            gsap.to(counter, {
                val: 100,
                duration: 0.4,
                ease: 'power2.out',
                onUpdate: () => setPercent(counter.val),
                onComplete: finish
            });
        };

        if (document.readyState === 'complete') onLoaded();
        else window.addEventListener('load', onLoaded, { once: true });
    });
}

/* ---------------------------------------------------------------------
   Lenis smooth scrolling, synced with GSAP's ticker + ScrollTrigger per
   the official integration recipe. Anchor links are intercepted so they
   scroll through Lenis (with an offset for the fixed navbar) instead of
   jumping instantly.
   --------------------------------------------------------------------- */
function initSmoothScroll() {
    if (hasLenis && motionEnabled) {
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        if (hasScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -70, duration: 1.2 });
            } else {
                target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });
}

/* --- Thin gradient bar at the top of the viewport tracking scroll progress --- */
function initScrollProgress() {
    const bar = $('.scroll-progress');
    if (!bar || !motionEnabled || !hasScrollTrigger) return;
    ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress}) translateX(-50%)`; }
    });
}

/* --- Custom cursor: dot + lagging ring + ambient spotlight. Desktop/fine
   pointer only; skipped entirely on touch devices and reduced motion. --- */
function initCustomCursor() {
    if (!motionEnabled || !hasFinePointer) return;
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    const glow = $('.cursor-glow');
    if (!dot || !ring) return;

    document.documentElement.classList.add('has-custom-cursor');

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    let glowX = null, glowY = null;
    if (glow) {
        glowX = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3' });
        glowY = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3' });
    }

    window.addEventListener('mousemove', (e) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
        if (glowX) { glowX(e.clientX); glowY(e.clientY); }
    });

    document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .menu-toggle').forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('cursor-ring--active'));
        el.addEventListener('mouseleave', () => ring.classList.remove('cursor-ring--active'));
    });

    document.querySelectorAll('input, textarea').forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('cursor-ring--text'));
        el.addEventListener('mouseleave', () => ring.classList.remove('cursor-ring--text'));
    });

    document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 }));
    document.addEventListener('mouseenter', () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 }));
}


/* --- Hero entrance: staggered reveal, SplitText char-in for the greeting,
   then hands off to the existing typewriter effect on the name. --- */
function playHeroIntro() {

    const heroContent = $('.hero-content');
    const greeting = $('.hero .greeting');
    const nameEl = $('.hero .name');
    const summary = $('.hero .summary');
    const cta = $('.hero-cta');
    const startTypewriter = () => { if (typeWriter) type(); };

    if (!motionEnabled || !heroContent) {
        startTypewriter();
        return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    let splitGreeting = null;

    if (hasSplitText && greeting) {
        try {
            splitGreeting = SplitText.create(greeting, { type: 'chars' });
        } catch (err) {
            splitGreeting = null;
        }
    }

    if (splitGreeting) {
        gsap.set(splitGreeting.chars, { opacity: 0, y: 16 });
        heroTasks.push(() => tl.to(splitGreeting.chars, { opacity: 1, y: 0, duration: 0.5, stagger: 0.02 }, 0.1));
    } else if (greeting) {
        gsap.set(greeting, { opacity: 0, y: 16 });
        heroTasks.push(() => tl.to(greeting, { opacity: 1, y: 0, duration: 0.6 }, 0.1));
    }

    if (nameEl) {
        gsap.set(nameEl, { opacity: 0, y: 20 });
        heroTasks.push(() => tl.to(nameEl, { opacity: 1, y: 0, duration: 0.7 }, 0.3));
    }
    if (summary) {
        gsap.set(summary, { opacity: 0, y: 20 });
        heroTasks.push(() => tl.to(summary, { opacity: 1, y: 0, duration: 0.7 }, 0.5));
    }
    if (cta && cta.children.length) {
        gsap.set(cta.children, { opacity: 0, y: 20 });
        heroTasks.push(() => tl.to(cta.children, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 0.65));
    }

    tl.call(startTypewriter);
}

/* --- Section titles: gradient divider lines draw in, heading text reveals
   through a masked line-wipe (SplitText) as each section is scrolled to. --- */
function initSectionTitleReveals() {
    if (!motionEnabled || !hasScrollTrigger) return;

    document.querySelectorAll('.section-title').forEach((title) => {
        const lines = title.querySelectorAll('.line');
        const textSpan = title.querySelector('span:not(.line)');
        let split = null;

        if (lines.length) gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' });

        if (hasSplitText && textSpan) {
            try {
                split = SplitText.create(textSpan, { type: 'lines, words', mask: 'lines' });
                gsap.set(split.words, { yPercent: 120, opacity: 0 });
            } catch (err) {
                split = null;
            }
        }
        if (!split) {
            const fallbackTarget = textSpan || title;
            gsap.set(fallbackTarget, { opacity: 0, y: 16 });
        }

        ScrollTrigger.create({
            trigger: title,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                if (lines.length) gsap.to(lines, { scaleX: 1, duration: 0.9, ease: 'power3.out' });
                if (split) {
                    gsap.to(split.words, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power3.out', delay: 0.1 });
                } else {
                    gsap.to(textSpan || title, { opacity: 1, y: 0, duration: 0.7 });
                }
            }
        });
    });
}

/* --- The about portrait wipes in with a clip-path reveal instead of a
   plain fade, for a bit of visual variety against the other sections. --- */
function initAboutImageReveal() {
    const aboutImage = $('.about-image');
    if (!aboutImage || !motionEnabled || !hasScrollTrigger) return;
    gsap.set(aboutImage, { clipPath: 'inset(0 0 100% 0)' });
    ScrollTrigger.create({
        trigger: aboutImage,
        start: 'top 80%',
        once: true,
        onEnter: () => gsap.to(aboutImage, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut' })
    });
}

/* --- Generic scroll-reveal for everything else still marked .fade-up
   (about text, contact info/form, etc.) - hero, section titles and the
   about image are excluded since they get their own bespoke treatment
   above, and skill/project cards below. --- */
function initFadeReveals() {
    if (!motionEnabled || !hasScrollTrigger) return;
    const targets = gsap.utils.toArray('.fade-up').filter((el) =>
        !el.closest('.hero') &&
        !el.classList.contains('section-title') &&
        !el.classList.contains('about-image') &&
        !el.classList.contains('skill-card') &&
        !el.classList.contains('project-card')
    );
    if (!targets.length) return;
    gsap.set(targets, { opacity: 0, y: 40 });
    ScrollTrigger.batch(targets, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true })
    });
}

/* --- Skill / project cards: staggered scroll-in by grid, dynamically
   injected so this runs after data.projectHtml/skillHtml are in the DOM. --- */
function initCardReveals() {
    if (!motionEnabled || !hasScrollTrigger) return;
    [skillsContainer, projectsGrid].forEach((grid) => {
        if (!grid) return;
        const cards = gsap.utils.toArray(grid.children);
        if (!cards.length) return;
        gsap.set(cards, { opacity: 0, y: 50 });
        ScrollTrigger.batch(cards, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, overwrite: true })
        });
    });
}

/* --- Skill proficiency bars fill and count up once scrolled into view,
   instead of the old version which animated on page load regardless of
   whether the section was ever visible. --- */
function initSkillProgress() {
    document.querySelectorAll('.skill-card').forEach((card) => {
        const bar = card.querySelector('.progress');
        const valueEl = card.querySelector('.progress-value');
        if (!bar) return;
        const target = parseFloat(bar.dataset.progress || '0');

        if (!motionEnabled || !hasScrollTrigger) {
            bar.style.width = target + '%';
            if (valueEl) valueEl.textContent = Math.round(target) + '%';
            return;
        }

        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(bar, { width: target + '%', duration: 1.4, ease: 'power3.out' });
                if (valueEl) {
                    const counter = { val: 0 };
                    gsap.to(counter, {
                        val: target,
                        duration: 1.4,
                        ease: 'power3.out',
                        onUpdate: () => { valueEl.textContent = Math.round(counter.val) + '%'; }
                    });
                }
            }
        });
    });
}

/* --- 3D mouse-tilt on skill & project cards (fine pointer only). --- */
function initTilt() {
    if (!motionEnabled || !hasFinePointer) return;
    document.querySelectorAll('.skill-card, .project-card, .contact-form').forEach((card) => {
        const max = 8;
    card.style.transition = "transform 0.4s cubic-bezier(0.16,1,0.3,1)";
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
    });
}

/* --- Magnetic pull on the hero CTAs and the back-to-top button. --- */
function initMagnetic() {
    if (!motionEnabled || !hasFinePointer) return;
    document.querySelectorAll('.hero-cta .btn, .back-to-top').forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * 0.3);
            yTo((e.clientY - rect.top - rect.height / 2) * 0.3);
        });
        el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
}

/* --- Floating ambient orbs behind the hero: a slow independent drift per
   orb, plus a subtle parallax shift toward the mouse for depth. --- */
function initHeroOrbs() {
    if (!motionEnabled) return;
    const wrap = $('.hero-orbs');
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    orbs.forEach((orb, i) => {
        gsap.to(orb, {
            x: (i % 2 === 0 ? 1 : -1) * gsap.utils.random(20, 45),
            y: gsap.utils.random(-35, 35),
            duration: gsap.utils.random(9, 16),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });

    if (wrap && hasFinePointer) {
        const hero = $('.hero');
        const parX = gsap.quickTo(wrap, 'x', { duration: 0.8, ease: 'power2' });
        const parY = gsap.quickTo(wrap, 'y', { duration: 0.8, ease: 'power2' });
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            parX(px * 30);
            parY(py * 30);
        });
        hero.addEventListener('mouseleave', () => { parX(0); parY(0); });
    }
}

/* --- Back-to-top button visibility + click-to-scroll. --- */
function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
}

/* --- Fade the hero scroll-cue out once the visitor actually scrolls. --- */
function initScrollCue() {
    const cue = $('.scroll-cue');
    if (!cue) return;
    window.addEventListener('scroll', () => {
        cue.classList.toggle('is-hidden', window.scrollY > 80);
    }, { passive: true });
}

/* --- Navbar: scrolled state + active-link tracking (unchanged behaviour,
   still works with Lenis since it keeps window.scrollY accurate). --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
    window.dispatchEvent(new Event('scroll'));

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) current = section.getAttribute('id');
        });
        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) link.classList.add('active');
        });
    }, { passive: true });
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('.nav-links');
    const navIcon = menuToggle ? menuToggle.querySelector('i') : null;
    if (!menuToggle || !navUl) return;

    menuToggle.addEventListener('click', () => {
        const isActive = navUl.classList.toggle('nav-active');
        menuToggle.setAttribute('aria-expanded', String(isActive));
        if (navIcon) navIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navUl.classList.remove('nav-active');
            menuToggle.setAttribute('aria-expanded', 'false');
            if (navIcon) navIcon.className = 'fas fa-bars';
        });
    });
}

/* ---------------------------------------------------------------------
   Boot sequence
   --------------------------------------------------------------------- */
(async function init() {
    runPreloader();
    safe(playHeroIntro, 'hero intro');
 
    if (projectsGrid) projectsGrid.innerHTML = data.projectHtml;
    if (skillsContainer) skillsContainer.innerHTML = data.skillHtml;

    safe(initNavbar, 'navbar');
    safe(initMobileMenu, 'mobile menu');
    safe(initSmoothScroll, 'smooth scroll');
    safe(initScrollProgress, 'scroll progress bar');
    safe(initHeroOrbs, 'hero orbs');
    safe(initSectionTitleReveals, 'section title reveals');
    safe(initAboutImageReveal, 'about image reveal');
    safe(initFadeReveals, 'fade-up reveals');
    safe(initCardReveals, 'card grid reveals');
    safe(initSkillProgress, 'skill progress bars');
    safe(initTilt, 'card tilt');
    safe(initMagnetic, 'magnetic buttons');
    safe(initCustomCursor, 'custom cursor');
    safe(initBackToTop, 'back to top');
    safe(initScrollCue, 'scroll cue');

    // Card images, lord-icon custom elements, and web fonts can all shift
    // layout slightly after their own async load, which can throw off
    // ScrollTrigger's cached trigger positions - one refresh shortly after
    // boot keeps every reveal point accurate.
    if (hasScrollTrigger) {
        setTimeout(() => ScrollTrigger.refresh(), 500);
    }
})();

/* ---------------------------------------------------------------------
   Typewriter effect on the hero name. Kicked off from playHeroIntro()
   above once the entrance animation completes (or immediately if motion
   is disabled), rather than unconditionally on script load, so it never
   types into a name element that's still animating in.
   --------------------------------------------------------------------- */
const textArray = ["Shivam Sharma", `A Full${isMobile ? "s" : " S"}tack Developer`, "A UI/UX Enthusiast", "A Backend Expert"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 1500;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!typeWriter.classList.contains("typing")) typeWriter.classList.add("typing");
        typeWriter.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        typeWriter.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!typeWriter.classList.contains("typing")) typeWriter.classList.add("typing");
        typeWriter.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        typeWriter.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = $('#contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const text = `Hello Shivam, I am ${formData.get('name')}.\n\n${formData.get('message')}\n\nYou can contact me back at ${formData.get('email')}`;
            const mailtoLink = `mailto:shivam8299.sharma@gmail.com?subject=${encodeURIComponent(formData.get('subject'))}&body=${encodeURIComponent(text)}`;
            window.location.href = mailtoLink;
        });
    }
});
