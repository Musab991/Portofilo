import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegisterSection } from "@/components/workshops/RegisterSection";
import { getLevel, getLevels, shortTitle } from "@/lib/workshops";

export const dynamicParams = false;

// One static page per level (static export). Levels without an open cohort
// get a "registration is closed" page instead of a 404, so old links keep working.
export function generateStaticParams() {
  return getLevels().map((level) => ({ slug: level.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const level = getLevel(slug);
  if (!level) return {};
  const title = `التسجيل — ${shortTitle(level)}`;
  return {
    title,
    description: `نموذج التسجيل في ${shortTitle(level)}: أول لقاءين تجربة بدون دفع.`,
    openGraph: { title, locale: "ar_JO" },
  };
}

export default async function LevelRegisterPage({ params }: Props) {
  const { slug } = await params;
  const level = getLevel(slug);
  if (!level) notFound();
  return <RegisterSection level={level} />;
}
