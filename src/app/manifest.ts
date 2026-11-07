import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "NOVA",
    description: "Modern hair salon in Riga. Book online.",
    start_url: "/lv",
    display: "standalone",
    background_color: "#eef1ef",
    theme_color: "#0f2e2b",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
