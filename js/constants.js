export const navLinks = ["home", "about", "skills", "projects", "content"];
const projects = [
    {
        title: "Sanatan AI",
        shortDescription: "A Google Gen-AI powered chatbot that provides insights into Sanatan Dharma.",
        description: "A Google Gen-AI powered NextJS fullstack chatbot that provides insights into Sanatan Dharma, answering questions and offering guidance on topics relating them to spiritual concepts. It significantly utilizes the potential of major web technologies. Available on desktop and mobile.",
        image: "assets/sanatan-ai.png",
        link: "https://sanatan.shivam.click/",
        github: "https://github.com/thesanatanai/sanatanai",
        terms: ["OAuth", "Resend", "Vercel", "Gemini AI", "Spirituality", "NextJS", "React", "TauriJS", "Tavliy"]
    },
    {
        title: "Sanatan Calendar",
        shortDescription: "A Sanatan calendar app that provides users with mighty hindu calendar, tithi, nakshatras, festivals and auspicious days.",
        description: "A Sanatan calendar app that provides users with information about tithi, nakshatras, and important dates and events related to Sanatan Dharma, including festivals, auspicious days, and other significant occasions.",
        image: "assets/calendar.png",
        link: "https://calendar.shivam.click/",
        github: "https://github.com/thesanatanai/calendar",
        terms: ["NextJS", "React", "Vercel", "TauriJS", "SEO", "Service Workers", "PWA"]
    },
    {
        title: "Bhagavat Gita",
        shortDescription: "A comprehensive Bhagavat Gita app with English translations and Hindi transliterations.",
        description: "A comprehensive Bhagavat Gita app that offers users access to all 18 chapters, complete with English translations and Hindi transliterations, providing an immersive experience for spiritual seekers. Available on desktop",
        image: "assets/gita.png",
        link: "https://ShivamSharma999.github.io/gita/",
        github: "https://github.com/ShivamSharma999/gita",
        terms: ["Vanilla JS", "Spirituality", "Github pages", "TauriJS"]
    },
    {
        title: "Sanatan Regexo",
        shortDescription: "A regex testing tool that allows users to test and validate regular expressions in real-time.",
        description: "A regex testing tool that allows users to test and validate regular expressions in real-time, providing instant results and explanation with examples.",
        image: "assets/regexo.png",
        link: "https://regexo.vercel.app/",
        github: "https://github.com/ShivamSharma999/regexo",
        terms: ["Vanilla JS", "Regex", "Vercel"]
    }
];
const skills = [
    {
        name: "HTML",
        description: "Pure HTML web development skills for small-scale beautiful and functional projects",
        icon: "fab fa-html5",
        progress: 97
    },
    {
        name: "CSS & TailwindCSS",
        description: "CSS and TailwindCSS skills for structured, beautiful, eye-catching and animated projects",
        icon: "fab fa-css3-alt",
        progress: 90
    },
    {
        name: "Javascript",
        description: "ES6+ and commonjs skills for well functional, secure and backend projects using different new technologies and frameworks.",
        icon: "fab fa-js",
        progress: 85
    },
    {
        name: "React & Next.JS",
        description: "ReactJS and Next.JS web development skills for large-scale, production-ready, beautiful and functional projects",
        icon: null,
        lordIcon: "./assets/icons/react.json",
        progress: 90
    },
    {
        name: "Git & Github",
        description: "Git and Github skills for source-control, data saving, contribution and publishing of project.",
        icon: null,
        lordIcon: './assets/icons/github.json',
        progress: 99
    },
    {
        name: "Express",
        description: "Express JS backend developing for building secure, functional and production ready backend projects and REST APIs.",
        icon: null,
        lordIcon: './assets/icons/cloud.json',
        progress: 90
    },
    {
        name: "MongoDB and Supabase",
        description: "MongoDB and Supabase skills for building secure, functional and production ready backend projects and data management systems.",
        icon: null,
        lordIcon: './assets/icons/db.json',
        progress: 80
    },
    {
        name: "Tauri and Electron",
        description: "TauriJS and Electron skills for building cross-platform desktop applications with web technologies.",
        icon: null,
        lordIcon: './assets/icons/desktop.json',
        progress: 80
    },
    {
        name: "GenAI",
        description: "Generative AI skills for integrating AI capabilities into applications, including response generation, query processing, and feedback understanding.",
        icon: null,
        lordIcon: './assets/icons/ai.json',
        progress: 70
    }

];
export const projectHtml = projects.map((project, index) => `
<div class="project-card fade-up delay-${index % 4}">
 <img src="${project.image}" alt="Preview of ${project.title}" loading="lazy" decoding="async">
 <div class="project-info">
    <h3>${project.title}</h3>
    <p>${project.shortDescription}</p>
    <div class="project-terms">
        ${project.terms.map(term => `<span class="term">${term}</span>`).join('')}
    </div>
 </div>
<div class="project-overlay">
    <h1 class="rank"><span>${index + 1}</span></h1>
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <div class="project-links">
        ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" aria-label="Open ${project.title} live site"><lord-icon src="./assets/icons/globe.json" trigger="hover" stroke="3"></lord-icon></a>` : ''}
        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} source code"><lord-icon src="./assets/icons/github.json" speed="2" stroke="3" trigger="hover"></lord-icon></a>` : ''}
    </div>
</div></div>`).join('');

export const skillHtml = skills.map((skill, i) => `
    <article class="skill-card fade-up delay-${i % 4}${skill.lordIcon ? ` lordicon-${i}` : ""}">
        ${skill.icon ? `<i class="${skill.icon}" aria-hidden="true"></i>` : (skill.lordIcon ? `<lord-icon src="${skill.lordIcon}" speed="2" trigger="hover" target=".lordicon-${i}"></lord-icon>` : '')}
        <h3>${skill.name}</h3>
        <p>${skill.description}</p>
        <div class="progress-bar"><span class="progress" style="width: ${skill.progress}%"></span></div>
    </article>
`).join('')
