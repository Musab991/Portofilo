import type { NextConfig } from "next";

// Static export for GitHub Pages (custom domain musabatieh.com at repo root).
// Without a custom domain, set GITHUB_PAGES=true to use /Portofilo base path.
const repo = "Portofilo";
const useProjectBasePath =
  process.env.GITHUB_PAGES === "true" && process.env.CUSTOM_DOMAIN !== "true";
const basePath = useProjectBasePath ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: useProjectBasePath ? `/${repo}/` : undefined,
  // Exposed so plain <img>/<a download> paths to /public files get the prefix
  // (next/link adds basePath automatically; raw asset URLs do not).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Two root layouts (English site + Arabic RTL workshops) need a global 404.
  experimental: { globalNotFound: true },
};

export default nextConfig;
