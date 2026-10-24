import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteUrl } from "@/lib/paths";
import { arabicFont, bodyFont } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Musab Atieh — ASP.NET Core & SQL Backend Developer",
    template: "%s — Musab Atieh",
  },
  description:
    "ASP.NET Core (.NET 8/9/10) developer in Amman. SQL schemas, stored procedures, EF & ADO.NET, Kafka — including AVL tracking for ~50,000 vehicles.",
  openGraph: {
    title: "Musab Atieh — ASP.NET Core & SQL Backend Developer",
    description:
      "Hire for ASP.NET Core APIs, SQL Server optimization, live AVL pipelines, and complex CRUD systems. From $20/hr.",
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
