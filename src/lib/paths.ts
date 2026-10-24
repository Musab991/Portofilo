const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a /public file path with the basePath (next/link does this itself; raw URLs don't). */
export function asset(path: string): string {
  return `${basePath}${path}`;
}

export const siteUrl = "https://musabatieh.com";
