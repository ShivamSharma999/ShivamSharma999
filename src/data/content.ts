export const SITE = {
  url: "https://shivam.click",
  name: "Shivam Sharma",
  title: "Shivam Sharma | Full-Stack Developer",
  description:
    "Portfolio of Shivam Sharma, a full-stack developer building thoughtful web experiences, desktop tools, and AI-powered products.",
  email: "shivam8299.sharma@gmail.com",
  phone: "+91 9983042812",
  location: "Sikar, Rajasthan, India",
  socials: [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/shivam-sharma-aa258a357/", icon: "linkedin" },
    { name: "GitHub", href: "https://github.com/shivamsharma999", icon: "github" },
    { name: "Twitter", href: "https://twitter.com/TheShivam9999", icon: "twitter" },
  ],
};

export const NAV = ["home", "about", "skills", "projects", "contact"] as const;

export const ABOUT = [
  "I'm a developer who enjoys turning ambitious ideas into polished, usable products. My work leans on clean front-end execution, strong interaction details, and practical problem solving.",
  "With a background in computer science and a passion for design, I thrive at the intersection of form and function. I love crafting interfaces that are not only visually appealing but also intuitive and efficient to use.",
  "Driven by a foundational background in Computer Science and an intrinsic passion for visual design, I thrive at the convergence of form and functional synergy. I specialize in architecting digital interfaces that blend aesthetic refinement with operational efficacy.",
  "For me, software development is not merely about writing computational logic—it is about sculpting intuitive, highly responsive, and accessible user experiences. I take immense joy in building modern digital tools that eliminate user friction, optimize workflows, and bring tangible value to the individuals navigating them."
];

export const PROJECTS = [
  {
    title: "Sanatan AI",
    short: "A Google Gen-AI powered chatbot that provides insights into Sanatan Dharma.",
    description:
      "A Google Gen-AI powered NextJS fullstack chatbot that provides insights into Sanatan Dharma, answering questions and offering guidance on topics relating them to spiritual concepts. Available on desktop and mobile.",
    image: "/assets/sanatan-ai.png",
    link: "https://sanatan.shivam.click/",
    github: "https://github.com/thesanatanai/sanatanai",
    terms: ["OAuth", "Resend", "Vercel", "Gemini AI", "NextJS", "React", "TauriJS", "Tavily"],
  },
  {
    title: "Sanatan Calendar",
    short: "A Hindu calendar app with tithi, nakshatras, festivals and auspicious days.",
    description:
      "A Sanatan calendar app that provides information about tithi, nakshatras, and important dates and events related to Sanatan Dharma, including festivals, auspicious days, and other significant occasions.",
    image: "/assets/calendar.png",
    link: "https://calendar.shivam.click/",
    github: "https://github.com/thesanatanai/calendar",
    terms: ["NextJS", "React", "Vercel", "TauriJS", "SEO", "Service Workers", "PWA"],
  },
  {
    title: "Bhagavat Gita",
    short: "A Bhagavat Gita app with English translations and Hindi transliterations.",
    description:
      "A comprehensive Bhagavat Gita app that offers access to all 18 chapters, complete with English translations and Hindi transliterations, providing an immersive experience for spiritual seekers. Available on desktop.",
    image: "/assets/gita.png",
    link: "https://ShivamSharma999.github.io/gita/",
    github: "https://github.com/ShivamSharma999/gita",
    terms: ["Vanilla JS", "GitHub Pages", "TauriJS"],
  },
  {
    title: "Sanatan Regexo",
    short: "A regex testing tool to test and validate regular expressions in real time.",
    description:
      "A regex testing tool that allows users to test and validate regular expressions in real-time, providing instant results and explanations with examples.",
    image: "/assets/regexo.png",
    link: "https://regexo.vercel.app/",
    github: "https://github.com/ShivamSharma999/regexo",
    terms: ["Vanilla JS", "Regex", "Vercel"],
  },
];

export const SKILLS = [
  { name: "HTML", mono: "</>", text: "Pure HTML for small-scale, beautiful and functional projects.", level: 97 },
  { name: "CSS & TailwindCSS", mono: "{ }", text: "Structured, eye-catching and animated interfaces.", level: 90 },
  { name: "JavaScript", mono: "JS", text: "ES6+ and CommonJS for secure, functional front and back ends.", level: 85 },
  { name: "React & Next.js", icon: "react", text: "Large-scale, production-ready and beautiful web apps.", level: 90 },
  { name: "Git & GitHub", icon: "github", text: "Source control, collaboration and publishing of projects.", level: 99 },
  { name: "Express", icon: "cloud", text: "Secure, production-ready backends and REST APIs.", level: 90 },
  { name: "MongoDB & Supabase", icon: "db", text: "Secure data management systems and backends.", level: 80 },
  { name: "Tauri & Electron", icon: "desktop", text: "Cross-platform desktop apps built with web technology.", level: 80 },
  { name: "GenAI", icon: "ai", text: "Response generation, query processing and feedback understanding.", level: 70 },
];

export const MARQUEE = ["Next.js", "React", "GSAP", "Three.js", "Tailwind", "Node.js", "Supabase", "Tauri", "Gemini AI", "MongoDB"];
