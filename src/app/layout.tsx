import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SITE } from "@/data/content";

export const viewport: Viewport = {
  themeColor: "#070b1a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s | Shivam Sharma" },
  description: SITE.description,
  keywords: [
    "Shivam Sharma",
    "full-stack developer",
    "web developer",
    "React",
    "Next.js",
    "GSAP",
    "Three.js",
    "JavaScript",
    "portfolio",
    "AI products",
    "Sikar",
    "Rajasthan",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    creator: "@TheShivam9999",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: { google: "bUq9gTph7XPEJE1BwcRWrmY9GCAOyG3XBj7cbrGeJDs" },
  icons: { icon: "/assets/logo.png", apple: "/assets/logo.png" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE.url}/#person`,
      name: SITE.name,
      url: SITE.url,
      jobTitle: "Full-Stack Developer",
      email: `mailto:${SITE.email}`,
      image: `${SITE.url}/assets/shivam.jpg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sikar",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
      sameAs: SITE.socials.map((s) => s.href),
      knowsAbout: [
        "JavaScript",
        "React",
        "Next.js",
        "Node.js",
        "MongoDB",
        "Generative AI",
        "GSAP",
        "Three.js",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { "@id": `${SITE.url}/#person` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="grain bg-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
