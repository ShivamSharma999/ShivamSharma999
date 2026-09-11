import * as data from './constants.js';
const $ = (selector) => document.querySelector(selector),
    loading = $('#preloader'),
    typeWriter = $('.type-writer'),
    projectsGrid = $('#projects .project-grid'),
    skillsContainer = $('.skills-container'),
    isMobile = window.innerWidth < 768,
    form = $('#contactForm');

document.addEventListener('DOMContentLoaded', async () => {
    loading.style.transform = 'translateY(-100%)';
    await new Promise(res => setTimeout(() => res(loading.remove()), 1000));
    projectsGrid.innerHTML = data.projectHtml;
    skillsContainer.innerHTML = data.skillHtml;
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);


    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));


    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled');
            navbar.classList.remove('scrolled');
        }
    });

    window.dispatchEvent(new Event('scroll'));
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('.nav-links');
    const navIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            const isActive = navUl.classList.toggle('nav-active');
            if (navIcon) {
                navIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('nav-active');
                if (navIcon) navIcon.className = 'fas fa-bars';
            });
        });
    }

});

const textArray = ["Shivam Sharma", `A Full${isMobile ? "s" : " S"}tack Developer`, "An UI/UX Enthusiast", "A Backend expert"];
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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const text = `Hello Shivam, I am ${formData.get('name')}.\n\n${formData.get('message')}\n\nYou can contact me back at ${formData.get('email')}`;
    const mailtoLink = `mailto:shivam8299.sharma@gmail.com?subject=${encodeURIComponent(formData.get('subject'))}&body=${encodeURIComponent(text)}`;
    window.open(mailtoLink, '_blank');
})
type();