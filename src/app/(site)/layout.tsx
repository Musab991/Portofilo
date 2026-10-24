import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteUrl } from "@/lib/paths";
import { arabicFont, bodyFont } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Musab Atieh — Full Stack .NET Developer",
    template: "%s — Musab Atieh",
  },
  description:
    "Full Stack .NET developer in Amman: C#, ASP.NET MVC, EF Core and SQL Server — mobile app backends, web dashboards, real-time AVL tracking and SQL performance tuning.",
  openGraph: {
    title: "Musab Atieh — Full Stack .NET Developer",
    description:
      "Hire for .NET backends and APIs, SQL Server optimization, real-time AVL tracking and GIS, and complex CRUD systems. From $20/hr.",
    type: "website",
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${bodyFont.variable} ${arabicFont.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
