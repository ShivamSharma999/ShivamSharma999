import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shivam Sharma | Full-Stack Developer",
    short_name: "Shivam Sharma",
    description:
      "Portfolio of Shivam Sharma, a full-stack developer building thoughtful web experiences and AI-powered products.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070b1a",
    theme_color: "#070b1a",
    icons: [
      {
        src: "/assets/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
