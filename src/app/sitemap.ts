import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";
import { siteUrl } from "@/lib/paths";
import { getLevels, getRegistrableLevels, registerPath } from "@/lib/workshops";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/projects/",
    ...projects.map((p) => `/projects/${p.id}/`),
    "/cv/",
    "/contact/",
    "/workshops/",
    ...getLevels().map((l) => `/workshops/${l.slug}/`),
    "/workshops/register/",
    ...getRegistrableLevels().map(registerPath),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
