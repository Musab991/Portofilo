import type { NextConfig } from "next";

// Static export for GitHub Pages (custom domain musabatieh.com at repo root).
// Without a custom domain, set GITHUB_PAGES=true to use /Portofilo base path.
const repo = "Portofilo";
const useProjectBasePath =
  process.env.GITHUB_PAGES === "true" && process.env.CUSTOM_DOMAIN !== "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: useProjectBasePath ? `/${repo}` : "",
  assetPrefix: useProjectBasePath ? `/${repo}/` : undefined,
};

export default nextConfig;
